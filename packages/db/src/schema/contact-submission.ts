import type { InferSelectModel } from "drizzle-orm";
import { index, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { auditFields } from "./audit-fields";

export const contactSubmissions = sqliteTable(
  "contact_submissions",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    question: text("question").notNull(),
    ...auditFields,
  },
  (table) => [
    index("contact_submissions_email_idx").on(table.email),
    index("contact_submissions_created_at_idx").on(table.createdAt),
  ]
);

export type ContactSubmission = InferSelectModel<typeof contactSubmissions>;
