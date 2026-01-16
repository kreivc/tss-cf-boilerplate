import { type InferSelectModel, relations } from "drizzle-orm";
import { index, real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { items } from "./item";

export const itemDetails = sqliteTable(
  "item_details",
  {
    id: text("id").primaryKey(),
    itemId: text("item_id")
      .notNull()
      .references(() => items.id),
    countryCode: text("country_code").notNull(), // e.g., 'ID', 'MY', 'US'
    symbol: text("symbol").notNull(), // Currency symbol: 'Rp', '$'
    price: real("price").notNull(),
  },
  (table) => [
    index("item_details_item_id_idx").on(table.itemId),
    index("item_details_country_idx").on(table.countryCode),
  ]
);

export const itemDetailsRelations = relations(itemDetails, ({ one }) => ({
  item: one(items, { fields: [itemDetails.itemId], references: [items.id] }),
}));

export type ItemDetail = InferSelectModel<typeof itemDetails>;
