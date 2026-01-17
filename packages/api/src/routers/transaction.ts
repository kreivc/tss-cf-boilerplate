import { env } from "cloudflare:workers";
import { db } from "@test-tss/db";
import { games } from "@test-tss/db/schema/game";
import { items } from "@test-tss/db/schema/item";
import { itemDetails } from "@test-tss/db/schema/item-detail";
import { transactions } from "@test-tss/db/schema/transaction";
import {
  CreateTransactionInput,
  GetTransactionInput,
  stringifyGameParams,
  TransactionStatus,
  UpdateTransactionStatusInput,
} from "@test-tss/types";
import { and, count, desc, eq, gte, lte, type SQL } from "drizzle-orm";
import { v7 } from "uuid";
import z from "zod";
import { protectedProcedure, publicProcedure } from "../index";
import { createPaymentGateway } from "../payment-gateway";

// Input schema for listing transactions with filters
const ListTransactionsInput = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
  status: TransactionStatus.optional(),
  gameId: z.string().optional(),
  startDate: z.string().optional(), // ISO date string
  endDate: z.string().optional(), // ISO date string
});

export const transactionRouter = {
  // List transactions with filters and pagination (admin only)
  list: protectedProcedure
    .input(ListTransactionsInput)
    .handler(async ({ input }) => {
      const { page, limit, status, gameId, startDate, endDate } = input;
      const offset = (page - 1) * limit;

      // Build filter conditions
      const conditions: SQL[] = [];
      if (status) {
        conditions.push(eq(transactions.status, status));
      }
      if (gameId) {
        conditions.push(eq(transactions.gameId, gameId));
      }
      if (startDate) {
        conditions.push(gte(transactions.createdAt, startDate));
      }
      if (endDate) {
        // Add a day to include the end date fully
        const endDatePlusOne = new Date(endDate);
        endDatePlusOne.setDate(endDatePlusOne.getDate() + 1);
        conditions.push(
          lte(transactions.createdAt, endDatePlusOne.toISOString())
        );
      }

      const whereClause =
        conditions.length > 0 ? and(...conditions) : undefined;

      // Get transactions with pagination
      const [data, totalResult] = await Promise.all([
        db
          .select()
          .from(transactions)
          .where(whereClause)
          .orderBy(desc(transactions.createdAt))
          .limit(limit)
          .offset(offset),
        db.select({ count: count() }).from(transactions).where(whereClause),
      ]);

      // Get related game and item data for each transaction
      const transactionsWithRelations = await Promise.all(
        data.map(async (txn) => {
          const [game, item] = await Promise.all([
            db.select().from(games).where(eq(games.id, txn.gameId)).limit(1),
            db.select().from(items).where(eq(items.id, txn.itemId)).limit(1),
          ]);
          return {
            ...txn,
            game: game[0] || null,
            item: item[0] || null,
          };
        })
      );

      return {
        data: transactionsWithRelations,
        total: totalResult[0]?.count ?? 0,
        page,
        limit,
        totalPages: Math.ceil((totalResult[0]?.count ?? 0) / limit),
      };
    }),

  // Create a new transaction
  create: publicProcedure
    .input(CreateTransactionInput)
    .handler(async ({ input }) => {
      const transactionId = v7();
      const now = new Date().toISOString();

      // Get item detail, item, and game to fetch price, item name, and game slug
      const [itemDetail, item, game] = await Promise.all([
        db
          .select()
          .from(itemDetails)
          .where(eq(itemDetails.id, input.itemDetailId))
          .limit(1),
        db.select().from(items).where(eq(items.id, input.itemId)).limit(1),
        db.select().from(games).where(eq(games.id, input.gameId)).limit(1),
      ]);

      if (!itemDetail[0]) {
        throw new Error("Item detail not found");
      }

      if (!item[0]) {
        throw new Error("Item not found");
      }

      if (!game[0]) {
        throw new Error("Game not found");
      }

      // Stringify input data for storage (to be used in callbacks and order display)
      // biome-ignore lint/suspicious/noExplicitAny: trust input for storage relative to game slug
      const inputData = stringifyGameParams(input.gameParams as any);

      // Generate reference ID for tracking
      const referenceId = `TOPUP-${transactionId.slice(0, 13).toUpperCase()}`;

      // Initialize payment gateway and create payment
      const paymentGateway = createPaymentGateway();

      const baseFEUrl = env.BASE_FRONTEND_URL;
      const callbackUrl = env.IPAYMU_CALLBACK_URL;

      const paymentResult = await paymentGateway.createPayment({
        referenceId,
        amount: itemDetail[0].price,
        currencySymbol: itemDetail[0].symbol,
        productName: item[0].name,
        quantity: 1,
        buyerEmail: input.email,
        returnUrl: `${baseFEUrl}/order/${transactionId}`,
        cancelUrl: `${baseFEUrl}/order/${transactionId}`,
        notifyUrl: `${callbackUrl}/api/webhook/payment`, // Webhook for payment notifications
      });

      if (!paymentResult.success) {
        throw new Error(
          paymentResult.errorMessage || "Failed to create payment"
        );
      }

      // Create transaction with PENDING status and payment URL
      await db.insert(transactions).values({
        id: transactionId,
        referenceId,
        gameId: input.gameId,
        itemId: input.itemId,
        itemDetailId: input.itemDetailId,
        paymentProvider: paymentGateway.name,
        totalPrice: itemDetail[0].price,
        status: "PENDING",
        paymentUrl: paymentResult.paymentUrl,
        inputData,
        email: input.email,
        gameSlug: game[0].slug,
        createdAt: now,
        createdBy: "guest", // Could be user ID if authenticated
        updatedAt: now,
        updatedBy: "guest",
      });

      return {
        transactionId,
        referenceId,
        paymentUrl: paymentResult.paymentUrl,
        sessionId: paymentResult.sessionId,
        status: "PENDING" as const,
      };
    }),

  // Get transaction by ID with related data
  getById: publicProcedure
    .input(GetTransactionInput)
    .handler(async ({ input }) => {
      const transaction = await db
        .select()
        .from(transactions)
        .where(eq(transactions.id, input.transactionId))
        .limit(1);

      if (!transaction[0]) {
        return null;
      }

      // Get related game
      const game = await db
        .select()
        .from(games)
        .where(eq(games.id, transaction[0].gameId))
        .limit(1);

      // Get related item
      const item = await db
        .select()
        .from(items)
        .where(eq(items.id, transaction[0].itemId))
        .limit(1);

      // Get related item detail
      const itemDetail = await db
        .select()
        .from(itemDetails)
        .where(eq(itemDetails.id, transaction[0].itemDetailId))
        .limit(1);

      // Payment URL is stored in the transaction record
      const paymentUrl =
        transaction[0].status === "PENDING" ? transaction[0].paymentUrl : null;

      return {
        ...transaction[0],
        game: game[0] || null,
        item: item[0] || null,
        itemDetail: itemDetail[0] || null,
        paymentUrl,
      };
    }),

  // Update transaction status (for testing)
  updateStatus: protectedProcedure
    .input(UpdateTransactionStatusInput)
    .handler(async ({ input, context }) => {
      const now = new Date().toISOString();
      const userId = context.session?.user?.id ?? "system";

      await db
        .update(transactions)
        .set({
          status: input.status,
          updatedAt: now,
          updatedBy: userId,
        })
        .where(eq(transactions.id, input.transactionId));

      return { success: true };
    }),
};
