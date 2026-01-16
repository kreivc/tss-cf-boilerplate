import { type InferSelectModel, relations } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { auditFields } from "./audit-fields";
import { items } from "./item";

export const games = sqliteTable(
  "games",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    category: text("category").notNull(), // e.g., 'MOBA', 'RPG'
    slug: text("slug").notNull().unique(), // Indexed automatically as unique
    isActive: integer("is_active", { mode: "boolean" }).default(true).notNull(),
    logo: text("logo"),
    banner: text("banner"),
    ...auditFields,
  },
  (table) => [
    index("games_slug_idx").on(table.slug),
    index("games_active_idx").on(table.isActive),
  ]
);

export const gamesRelations = relations(games, ({ many }) => ({
  items: many(items),
}));

export type Game = InferSelectModel<typeof games>;
