import type { RouterClient } from "@orpc/server";
import { accountRouter } from "./account";
import { contactRouter } from "./contact";
import { gameRouter } from "./game";
import { itemRouter } from "./item";
import { mediaRouter } from "./media";
import { transactionRouter } from "./transaction";
import { uploadRouter } from "./upload";

export const appRouter = {
  game: gameRouter,
  item: itemRouter,
  upload: uploadRouter,
  account: accountRouter,
  transaction: transactionRouter,
  media: mediaRouter,
  contact: contactRouter,
};
export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
