import type { RouterClient } from "@orpc/server";
import { v7 } from "uuid";
import { protectedProcedure, publicProcedure } from "../index";
import { accountRouter } from "./account";
import { gameRouter } from "./game";
import { itemRouter } from "./item";
import { mediaRouter } from "./media";
import { todoRouter } from "./todo";
import { transactionRouter } from "./transaction";
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
  account: accountRouter,
  transaction: transactionRouter,
  media: mediaRouter,
};
export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
