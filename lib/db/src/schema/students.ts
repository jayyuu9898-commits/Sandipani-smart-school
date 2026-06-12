import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const studentsTable = pgTable("students", {
  id: text("id").primaryKey(),
  fullName: text("full_name").notNull(),
  rollNo: integer("roll_no").notNull(),
  className: text("class_name").notNull(),
  section: text("section").notNull(),
  stream: text("stream"),
  additionalSubject: text("additional_subject"),
  gender: text("gender"),
  dateOfBirth: text("date_of_birth"),
  parentName: text("parent_name"),
  parentMobile: text("parent_mobile"),
  address: text("address"),
  email: text("email"),
  phone: text("phone"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertStudentSchema = createInsertSchema(studentsTable);
export type InsertStudent = z.infer<typeof insertStudentSchema>;
export type Student = typeof studentsTable.$inferSelect;
