import { type InferSelectModel, relations } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { auditFields } from "./audit-fields";
import { games } from "./game";
import { itemDetails } from "./item-detail";

export const items = sqliteTable(
  "items",
  {
    id: text("id").primaryKey(),
    slug: text("item_slug").notNull(),
    gameId: text("game_id")
      .notNull()
      .references(() => games.id),
    name: text("name").notNull(),
    logo: text("logo"),
    category: text("category").notNull(), // e.g., 'Diamond', 'Skins'
    isActive: integer("is_active", { mode: "boolean" }).default(true).notNull(),
    ...auditFields,
  },
  (table) => [
    index("items_game_id_idx").on(table.gameId),
    index("items_active_idx").on(table.isActive),
  ]
);

export const itemsRelations = relations(items, ({ one, many }) => ({
  game: one(games, { fields: [items.gameId], references: [games.id] }),
  details: many(itemDetails),
}));

export type Item = InferSelectModel<typeof items>;
