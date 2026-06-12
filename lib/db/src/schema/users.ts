import { pgTable, varchar, boolean, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: varchar("id", { length: 36 }).primaryKey(),
  fullName: varchar("full_name", { length: 200 }).notNull(),
  email: varchar("email", { length: 255 }).unique(),
  mobileNumber: varchar("mobile_number", { length: 15 }).unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  role: varchar("role", { length: 20 }).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
