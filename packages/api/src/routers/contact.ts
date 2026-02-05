import { db } from "@test-tss/db";
import { contactSubmissions } from "@test-tss/db/schema/contact-submission";
import { CreateContactInput, PaginationInput } from "@test-tss/types";
import { count, desc } from "drizzle-orm";
import { v7 } from "uuid";
import { protectedProcedure, publicProcedure } from "../index";

export const contactRouter = {
  submit: publicProcedure
    .input(CreateContactInput)
    .handler(async ({ input }) => {
      const id = v7();
      await db.insert(contactSubmissions).values({
        id,
        name: input.name,
        email: input.email,
        question: input.question,
        createdBy: "anonymous",
        updatedBy: "anonymous",
      });
      return { success: true };
    }),

  getAll: protectedProcedure
    .input(PaginationInput.optional())
    .handler(async ({ input }) => {
      const page = input?.page ?? 1;
      const limit = input?.limit ?? 100;
      const offset = (page - 1) * limit;

      const [data, totalResult] = await Promise.all([
        db
          .select()
          .from(contactSubmissions)
          .orderBy(desc(contactSubmissions.createdAt))
          .limit(limit)
          .offset(offset),
        db.select({ count: count() }).from(contactSubmissions),
      ]);

      return {
        data,
        total: totalResult[0]?.count ?? 0,
        page,
        limit,
        totalPages: Math.ceil((totalResult[0]?.count ?? 0) / limit),
      };
    }),
};
