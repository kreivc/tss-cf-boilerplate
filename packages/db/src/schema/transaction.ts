import { type InferSelectModel, relations } from "drizzle-orm";
import { index, real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { auditFields } from "./audit-fields";
import { games } from "./game";
import { items } from "./item";
import { itemDetails } from "./item-detail";

export const transactions = sqliteTable(
  "transactions",
  {
    id: text("id").primaryKey(), // Your internal ID
    referenceId: text("reference_id").unique(), // External PG ID
    gameId: text("game_id")
      .notNull()
      .references(() => games.id),
    itemId: text("item_id")
      .notNull()
      .references(() => items.id),
    itemDetailId: text("item_detail_id")
      .notNull()
      .references(() => itemDetails.id),
    paymentProvider: text("payment_provider").notNull(),
    totalPrice: real("total_price").notNull(),
    status: text("status").notNull().default("PENDING"), // PENDING, PAID, SUCCESS, FAILED
    responseString: text("response_string"), // For provider logs/errors
    ...auditFields,
  },
  (table) => [
    index("transactions_ref_idx").on(table.referenceId),
    index("transactions_status_idx").on(table.status),
    index("transactions_game_item_idx").on(table.gameId, table.itemId),
  ]
);

export const transactionsRelations = relations(transactions, ({ one }) => ({
  game: one(games, { fields: [transactions.gameId], references: [games.id] }),
  item: one(items, { fields: [transactions.itemId], references: [items.id] }),
  detail: one(itemDetails, {
    fields: [transactions.itemDetailId],
    references: [itemDetails.id],
  }),
}));

export type Transaction = InferSelectModel<typeof transactions>;
