import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const classesTable = pgTable("classes", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  section: text("section").notNull(),
  teacherId: text("teacher_id"),
  studentCount: integer("student_count").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertClassSchema = createInsertSchema(classesTable);
export type InsertClass = z.infer<typeof insertClassSchema>;
export type SchoolClass = typeof classesTable.$inferSelect;
