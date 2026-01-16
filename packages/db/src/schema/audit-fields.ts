import { sql } from "drizzle-orm";
import { text } from "drizzle-orm/sqlite-core";

export const auditFields = {
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`).notNull(),
  createdBy: text("created_by").notNull(),
  updatedAt: text("updated_at").default(sql`(CURRENT_TIMESTAMP)`).notNull(),
  updatedBy: text("updated_by").notNull(),
  deletedAt: text("deleted_at"),
  deletedBy: text("deleted_by"),
};
