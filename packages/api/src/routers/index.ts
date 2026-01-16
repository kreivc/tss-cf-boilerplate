import type { RouterClient } from "@orpc/server";
import { v7 } from "uuid";
import { protectedProcedure, publicProcedure } from "../index";
import { gameRouter } from "./game";
import { itemRouter } from "./item";
import { todoRouter } from "./todo";
import { uploadRouter } from "./upload";

export const appRouter = {
  healthCheck: publicProcedure.handler(() => {
    return "OK";
  }),
  privateData: protectedProcedure.handler(({ context }) => {
    return {
      message: "This is private",
      user: context.session?.user,
      id: v7(),
    };
  }),
  todo: todoRouter,
  game: gameRouter,
  item: itemRouter,
  upload: uploadRouter,
};
export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
