import { db } from "@test-tss/db";
import { games } from "@test-tss/db/schema/game";
import { items } from "@test-tss/db/schema/item";
import { itemDetails } from "@test-tss/db/schema/item-detail";
import {
  CreateGameInput,
  PaginationInput,
  UpdateGameInput,
} from "@test-tss/types";
import { and, count, desc, eq, isNull, like } from "drizzle-orm";
import { v7 } from "uuid";
import z from "zod";
import { protectedProcedure, publicProcedure } from "../index";

export const gameRouter = {
  // Get all games with pagination and search
  getAll: publicProcedure
    .input(
      PaginationInput.extend({
        search: z.string().optional(),
        activeOnly: z.boolean().optional(),
      }).optional()
    )
    .handler(async ({ input }) => {
      const page = input?.page ?? 1;
      const limit = input?.limit ?? 100;
      const offset = (page - 1) * limit;

      // biome-ignore lint/suspicious/noEvolvingTypes: <we need to use any for the conditions>
      const conditions = [];
      // Always exclude soft-deleted games
      conditions.push(isNull(games.deletedAt));
      if (input?.search) {
        conditions.push(like(games.name, `%${input.search}%`));
      }
      if (input?.activeOnly) {
        conditions.push(eq(games.isActive, true));
      }

      const whereClause =
        conditions.length > 0 ? and(...conditions) : undefined;

      const [data, totalResult] = await Promise.all([
        db
          .select()
          .from(games)
          .where(whereClause)
          .orderBy(desc(games.createdAt))
          .limit(limit)
          .offset(offset),
        db.select({ count: count() }).from(games).where(whereClause),
      ]);

      return {
        data,
        total: totalResult[0]?.count ?? 0,
        page,
        limit,
        totalPages: Math.ceil((totalResult[0]?.count ?? 0) / limit),
      };
    }),

  // Get single game by slug
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .handler(async ({ input }) => {
      const result = await db
        .select()
        .from(games)
        .where(and(eq(games.slug, input.slug), isNull(games.deletedAt)))
        .limit(1);

      return result[0] ?? null;
    }),

  // Get game with items and details (for game detail page)
  getWithItems: publicProcedure
    .input(
      z.object({
        slug: z.string(),
        countryCode: z.string().optional(),
      })
    )
    .handler(async ({ input }) => {
      // Get game by slug
      const game = await db
        .select()
        .from(games)
        .where(and(eq(games.slug, input.slug), isNull(games.deletedAt)))
        .limit(1);

      if (!game[0]) {
        return null;
      }

      // Get items for this game
      const gameItems = await db
        .select()
        .from(items)
        .where(and(eq(items.gameId, game[0].id), eq(items.isActive, true)));

      // Get details for each item
      const itemsWithDetails = await Promise.all(
        gameItems.map(async (item) => {
          const detailsQuery = db
            .select()
            .from(itemDetails)
            .where(eq(itemDetails.itemId, item.id));

          const details = await detailsQuery;

          // Filter by country code if provided
          const filteredDetails = input.countryCode
            ? details.filter((d) => d.countryCode === input.countryCode)
            : details;

          return {
            ...item,
            details: filteredDetails.length > 0 ? filteredDetails : details,
          };
        })
      );

      return {
        ...game[0],
        items: itemsWithDetails,
      };
    }),

  // Create new game (admin only)
  create: protectedProcedure
    .input(CreateGameInput)
    .handler(async ({ input, context }) => {
      const id = v7();
      const now = new Date().toISOString();
      const userId = context.session?.user?.id ?? "system";

      await db.insert(games).values({
        id,
        name: input.name,
        slug: input.slug,
        category: input.category,
        logo: input.logo || null,
        banner: input.banner || null,
        isActive: input.isActive,
        createdAt: now,
        createdBy: userId,
        updatedAt: now,
        updatedBy: userId,
      });

      return { id, slug: input.slug };
    }),

  // Update game (admin only)
  update: protectedProcedure
    .input(UpdateGameInput)
    .handler(async ({ input, context }) => {
      const { id, ...updateData } = input;
      const now = new Date().toISOString();
      const userId = context.session?.user?.id ?? "system";

      await db
        .update(games)
        .set({
          ...updateData,
          logo: updateData.logo || null,
          banner: updateData.banner || null,
          updatedAt: now,
          updatedBy: userId,
        })
        .where(eq(games.id, id));

      return { success: true };
    }),

  // Delete game (soft delete - admin only)
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .handler(async ({ input, context }) => {
      const now = new Date().toISOString();
      const userId = context.session?.user?.id ?? "system";

      await db
        .update(games)
        .set({
          isActive: false,
          updatedAt: now,
          updatedBy: userId,
          deletedAt: now,
          deletedBy: userId,
        })
        .where(eq(games.id, input.id));

      return { success: true };
    }),

  // Hard delete game (admin only)
  hardDelete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .handler(async ({ input }) => {
      await db.delete(games).where(eq(games.id, input.id));
      return { success: true };
    }),
};
