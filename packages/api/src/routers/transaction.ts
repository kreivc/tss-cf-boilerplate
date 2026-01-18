import { env } from "cloudflare:workers";
import { db } from "@test-tss/db";
import { games } from "@test-tss/db/schema/game";
import { items } from "@test-tss/db/schema/item";
import { itemDetails } from "@test-tss/db/schema/item-detail";
import { transactions } from "@test-tss/db/schema/transaction";
import { stringifyGameParams } from "@test-tss/game-provider";
import {
  getCallbackUrl,
  getPaymentGateway,
  TransactionStatus,
} from "@test-tss/payment-gateway";
import {
  CreateTransactionInput,
  GetTransactionInput,
  UpdateTransactionStatusInput,
} from "@test-tss/types";
import { and, count, desc, eq, gte, lte, type SQL } from "drizzle-orm";
import { v7 } from "uuid";
import z from "zod";
import { protectedProcedure, publicProcedure } from "../index";

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
        conditions.push(lte(transactions.createdAt, endDate));
      }

      const whereClause =
        conditions.length > 0 ? and(...conditions) : undefined;

      const [transactionList, totalResult] = await Promise.all([
        db
          .select({
            id: transactions.id,
            referenceId: transactions.referenceId,
            gameId: transactions.gameId,
            itemId: transactions.itemId,
            totalPrice: transactions.totalPrice,
            status: transactions.status,
            paymentUrl: transactions.paymentUrl,
            paymentProvider: transactions.paymentProvider,
            createdAt: transactions.createdAt,
            updatedAt: transactions.updatedAt,
            game: {
              id: games.id,
              name: games.name,
              slug: games.slug,
            },
            item: {
              id: items.id,
              name: items.name,
            },
          })
          .from(transactions)
          .leftJoin(games, eq(transactions.gameId, games.id))
          .leftJoin(items, eq(transactions.itemId, items.id))
          .where(whereClause)
          .orderBy(desc(transactions.createdAt))
          .limit(limit)
          .offset(offset),
        db.select({ count: count() }).from(transactions).where(whereClause),
      ]);

      return {
        transactions: transactionList,
        pagination: {
          page,
          limit,
          total: totalResult[0]?.count ?? 0,
          totalPages: Math.ceil((totalResult[0]?.count ?? 0) / limit),
        },
      };
    }),

  // Get transaction status and details by ID
  getById: publicProcedure
    .input(GetTransactionInput)
    .handler(async ({ input }) => {
      const result = await db
        .select({
          id: transactions.id,
          referenceId: transactions.referenceId,
          gameId: transactions.gameId,
          itemId: transactions.itemId,
          itemDetailId: transactions.itemDetailId,
          inputData: transactions.inputData,
          email: transactions.email,
          totalPrice: transactions.totalPrice,
          status: transactions.status,
          paymentUrl: transactions.paymentUrl,
          paymentProvider: transactions.paymentProvider,
          createdAt: transactions.createdAt,
          updatedAt: transactions.updatedAt,
          game: {
            id: games.id,
            name: games.name,
            slug: games.slug,
            logo: games.logo,
          },
          item: {
            id: items.id,
            name: items.name,
            logo: items.logo,
          },
          itemDetail: {
            id: itemDetails.id,
            symbol: itemDetails.symbol,
            price: itemDetails.price,
          },
        })
        .from(transactions)
        .leftJoin(games, eq(transactions.gameId, games.id))
        .leftJoin(items, eq(transactions.itemId, items.id))
        .leftJoin(itemDetails, eq(transactions.itemDetailId, itemDetails.id))
        .where(eq(transactions.id, input.transactionId))
        .limit(1);

      if (!result[0]) {
        throw new Error("Transaction not found");
      }

      return result[0];
    }),

  // Create a new transaction
  create: publicProcedure
    .input(CreateTransactionInput)
    .handler(async ({ input }) => {
      // Generate transaction ID
      const transactionId = v7();

      // Get game, item, and pricing info in parallel
      const [game, item, itemDetail] = await Promise.all([
        db.select().from(games).where(eq(games.id, input.gameId)).limit(1),
        db.select().from(items).where(eq(items.id, input.itemId)).limit(1),
        db
          .select()
          .from(itemDetails)
          .where(eq(itemDetails.id, input.itemDetailId))
          .limit(1),
      ]);

      if (!itemDetail[0]) {
        throw new Error("Item pricing not found");
      }

      if (!item[0]) {
        throw new Error("Item not found");
      }

      if (!game[0]) {
        throw new Error("Game not found");
      }

      // Stringify input data for storage
      // biome-ignore lint/suspicious/noExplicitAny: trust input for storage relative to game slug
      const inputData = stringifyGameParams(input.gameParams as any);

      // Use transaction ID as reference ID
      const referenceId = transactionId;

      // Get payment gateway - clean one-liner! 🎉
      const paymentProvider = input.paymentMethod.toUpperCase() as "IPAYMU";
      const paymentGateway = getPaymentGateway(paymentProvider);
      const callbackUrl = getCallbackUrl(paymentProvider);
      const baseFEUrl = env.BASE_FRONTEND_URL;

      const paymentResult = await paymentGateway.createPayment({
        referenceId,
        amount: itemDetail[0].price,
        currencySymbol: itemDetail[0].symbol,
        productName: item[0].name,
        quantity: 1,
        buyerEmail: input.email,
        returnUrl: `${baseFEUrl}/order/${transactionId}`,
        cancelUrl: `${baseFEUrl}/order/${transactionId}`,
        notifyUrl: `${callbackUrl}/api/webhook/payment`,
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
        gameSlug: game[0].slug,
        gameId: input.gameId,
        itemId: input.itemId,
        itemDetailId: input.itemDetailId,
        inputData,
        email: input.email,
        totalPrice: itemDetail[0].price,
        status: "PENDING",
        paymentUrl: paymentResult.paymentUrl,
        paymentProvider: input.paymentMethod.toUpperCase(),
        createdAt: new Date().toISOString(),
        createdBy: "system",
        updatedAt: new Date().toISOString(),
        updatedBy: "system",
      });

      return {
        transactionId,
        paymentUrl: paymentResult.paymentUrl,
        referenceId,
      };
    }),

  // Update transaction status (for webhooks)
  updateStatus: publicProcedure
    .input(UpdateTransactionStatusInput)
    .handler(async ({ input }) => {
      await db
        .update(transactions)
        .set({
          status: input.status,
          updatedAt: new Date().toISOString(),
          updatedBy: "webhook",
        })
        .where(eq(transactions.id, input.transactionId));

      return { success: true };
    }),
};
