import { db } from "@test-tss/db";
import { games } from "@test-tss/db/schema/game";
import { items } from "@test-tss/db/schema/item";
import { itemDetails } from "@test-tss/db/schema/item-detail";
import { CreateItemInput, UpdateItemInput } from "@test-tss/types";
import { and, count, desc, eq, like } from "drizzle-orm";
import { v7 } from "uuid";
import z from "zod";
import { protectedProcedure, publicProcedure } from "../index";

export const itemRouter = {
  // Get items by game slug with pagination
  getByGame: publicProcedure
    .input(
      z.object({
        gameSlug: z.string(),
        search: z.string().optional(),
        activeOnly: z.boolean().optional(),
        page: z.number().int().positive().default(1),
        limit: z.number().int().positive().max(100).default(500),
      })
    )
    .handler(async ({ input }) => {
      const { gameSlug, page, limit, search, activeOnly } = input;
      const offset = (page - 1) * limit;

      // Get game by slug first
      const game = await db
        .select()
        .from(games)
        .where(eq(games.slug, gameSlug))
        .limit(1);

      if (!game[0]) {
        return {
          data: [],
          game: null,
          total: 0,
          page,
          limit,
          totalPages: 0,
        };
      }

      const conditions = [eq(items.gameId, game[0].id)];
      if (search) {
        conditions.push(like(items.name, `%${search}%`));
      }
      if (activeOnly) {
        conditions.push(eq(items.isActive, true));
      }

      const whereClause = and(...conditions);

      const [data, totalResult] = await Promise.all([
        db
          .select()
          .from(items)
          .where(whereClause)
          .orderBy(desc(items.createdAt))
          .limit(limit)
          .offset(offset),
        db.select({ count: count() }).from(items).where(whereClause),
      ]);

      // Get pricing for each item
      const itemsWithPricing = await Promise.all(
        data.map(async (item) => {
          const details = await db
            .select()
            .from(itemDetails)
            .where(eq(itemDetails.itemId, item.id));
          return { ...item, details };
        })
      );

      return {
        data: itemsWithPricing,
        game: game[0],
        total: totalResult[0]?.count ?? 0,
        page,
        limit,
        totalPages: Math.ceil((totalResult[0]?.count ?? 0) / limit),
      };
    }),

  // Get single item by slug with all pricing details
  getBySlug: publicProcedure
    .input(z.object({ gameSlug: z.string(), itemSlug: z.string() }))
    .handler(async ({ input }) => {
      // Get game first
      const game = await db
        .select()
        .from(games)
        .where(eq(games.slug, input.gameSlug))
        .limit(1);

      if (!game[0]) {
        return null;
      }

      const result = await db
        .select()
        .from(items)
        .where(
          and(eq(items.gameId, game[0].id), eq(items.slug, input.itemSlug))
        )
        .limit(1);

      if (!result[0]) {
        return null;
      }

      const details = await db
        .select()
        .from(itemDetails)
        .where(eq(itemDetails.itemId, result[0].id));

      return {
        ...result[0],
        game: game[0],
        details,
      };
    }),

  // Create new item with pricing (admin only)
  create: protectedProcedure
    .input(CreateItemInput)
    .handler(async ({ input, context }) => {
      const itemId = v7();
      const now = new Date().toISOString();
      const userId = context.session?.user?.id ?? "system";

      // Insert item
      await db.insert(items).values({
        id: itemId,
        gameId: input.gameId,
        name: input.name,
        slug: input.slug,
        category: input.category,
        logo: input.logo || null,
        isActive: input.isActive,
        createdAt: now,
        createdBy: userId,
        updatedAt: now,
        updatedBy: userId,
      });

      // Insert pricing details
      for (const detail of input.details) {
        await db.insert(itemDetails).values({
          id: v7(),
          itemId,
          countryCode: detail.countryCode,
          symbol: detail.symbol,
          price: detail.price,
        });
      }

      return { id: itemId, slug: input.slug };
    }),

  // Update item and pricing (admin only)
  update: protectedProcedure
    .input(UpdateItemInput)
    .handler(async ({ input, context }) => {
      const { id, details, ...updateData } = input;
      const now = new Date().toISOString();
      const userId = context.session?.user?.id ?? "system";

      // Update item
      await db
        .update(items)
        .set({
          ...updateData,
          logo: updateData.logo || null,
          updatedAt: now,
          updatedBy: userId,
        })
        .where(eq(items.id, id));

      // Update pricing if provided
      if (details) {
        // Get existing item details
        const existingDetails = await db
          .select()
          .from(itemDetails)
          .where(eq(itemDetails.itemId, id));

        // Create a map of existing details by countryCode
        const existingByCountry = new Map(
          existingDetails.map((d) => [d.countryCode, d])
        );

        // Track which country codes are in the new details
        const newCountryCodes = new Set(details.map((d) => d.countryCode));

        // Update or insert each detail
        for (const detail of details) {
          const existing = existingByCountry.get(detail.countryCode);
          if (existing) {
            // Update existing detail - only price changes, symbol is coupled with countryCode
            await db
              .update(itemDetails)
              .set({
                price: detail.price,
              })
              .where(eq(itemDetails.id, existing.id));
          } else {
            // Insert new detail
            await db.insert(itemDetails).values({
              id: v7(),
              itemId: id,
              countryCode: detail.countryCode,
              symbol: detail.symbol,
              price: detail.price,
            });
          }
        }

        // Delete old details that are no longer needed
        // Only delete if the countryCode is not in the new details
        for (const existing of existingDetails) {
          if (
            !newCountryCodes.has(
              existing.countryCode as (typeof details)[number]["countryCode"]
            )
          ) {
            // Try to delete - if it fails due to FK constraint, just skip
            try {
              await db
                .delete(itemDetails)
                .where(eq(itemDetails.id, existing.id));
            } catch {
              // If deletion fails (FK constraint from transactions), just leave it
              // The item detail is still valid, just not actively used
              console.warn(
                `Could not delete itemDetail ${existing.id} - likely referenced by transactions`
              );
            }
          }
        }
      }

      return { success: true };
    }),

  // Delete item (soft delete - admin only)
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .handler(async ({ input, context }) => {
      const now = new Date().toISOString();
      const userId = context.session?.user?.id ?? "system";

      await db
        .update(items)
        .set({
          isActive: false,
          updatedAt: now,
          updatedBy: userId,
          deletedAt: now,
          deletedBy: userId,
        })
        .where(eq(items.id, input.id));

      return { success: true };
    }),

  // Hard delete item (admin only)
  hardDelete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .handler(async ({ input }) => {
      // Delete pricing first
      await db.delete(itemDetails).where(eq(itemDetails.itemId, input.id));
      // Delete item
      await db.delete(items).where(eq(items.id, input.id));
      return { success: true };
    }),
};
