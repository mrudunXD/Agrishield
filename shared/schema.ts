import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const profileStates = sqliteTable("profile_states", {
  id: text("id").primaryKey(),
  data: text("data").notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export type ProfileStateRow = typeof profileStates.$inferSelect;
export type ProfileStateInsert = typeof profileStates.$inferInsert;
