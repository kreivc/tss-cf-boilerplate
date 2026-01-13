import { env } from "cloudflare:workers";
import { db } from "@test-tss/db";
import { todo } from "@test-tss/db/schema/todo";
import type { SendEmailData } from "@test-tss/types";
import { eq } from "drizzle-orm";
import z from "zod";
import { publicProcedure } from "../index";

export const todoRouter = {
  getAll: publicProcedure.handler(async () => {
    return await db.select().from(todo);
  }),

  create: publicProcedure
    .input(z.object({ text: z.string().min(1) }))
    .handler(async ({ input }) => {
      const data: SendEmailData = {
        name: "Test Send",
        email: "test@test.com",
        subject: "Test Email",
        text: input.text,
      };
      await env.QUEUE.send(data);
      return await db.insert(todo).values({
        text: input.text,
      });
    }),

  toggle: publicProcedure
    .input(z.object({ id: z.number(), completed: z.boolean() }))
    .handler(async ({ input }) => {
      return await db
        .update(todo)
        .set({ completed: input.completed })
        .where(eq(todo.id, input.id));
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .handler(async ({ input }) => {
      return await db.delete(todo).where(eq(todo.id, input.id));
    }),
};
