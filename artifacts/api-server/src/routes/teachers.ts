import { Router, type IRouter } from "express";
import { eq, ilike, or, sql } from "drizzle-orm";
import { db, teachersTable } from "@workspace/db";
import {
  CreateTeacherBody,
  UpdateTeacherBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

function generateTeacherId(count: number): string {
  const year = new Date().getFullYear();
  const num = String(count + 1).padStart(3, "0");
  return `TCH-${year}-${num}`;
}

router.get("/teachers", async (req, res) => {
  try {
    const { search } = req.query as { search?: string };

    const teachers = search
      ? await db
          .select()
          .from(teachersTable)
          .where(
            or(
              ilike(teachersTable.fullName, `%${search}%`),
              ilike(teachersTable.id, `%${search}%`),
              ilike(teachersTable.subject, `%${search}%`),
            ),
          )
      : await db.select().from(teachersTable).orderBy(teachersTable.createdAt);

    res.json(teachers);
  } catch (err) {
    req.log.error(err, "Failed to list teachers");
    res.status(500).json({ error: "Failed to list teachers" });
  }
});

router.post("/teachers", async (req, res) => {
  try {
    const parsed = CreateTeacherBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }

    const all = await db.select({ count: sql<number>`count(*)` }).from(teachersTable);
    const count = Number(all[0]?.count ?? 0);
    const id = generateTeacherId(count);

    const [teacher] = await db
      .insert(teachersTable)
      .values({ id, ...parsed.data })
      .returning();

    res.status(201).json(teacher);
  } catch (err) {
    req.log.error(err, "Failed to create teacher");
    res.status(500).json({ error: "Failed to create teacher" });
  }
});

router.get("/teachers/:id", async (req, res) => {
  try {
    const [teacher] = await db
      .select()
      .from(teachersTable)
      .where(eq(teachersTable.id, req.params.id));

    if (!teacher) {
      res.status(404).json({ error: "Teacher not found" });
      return;
    }
    res.json(teacher);
  } catch (err) {
    req.log.error(err, "Failed to get teacher");
    res.status(500).json({ error: "Failed to get teacher" });
  }
});

router.put("/teachers/:id", async (req, res) => {
  try {
    const parsed = UpdateTeacherBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }

    const [teacher] = await db
      .update(teachersTable)
      .set(parsed.data)
      .where(eq(teachersTable.id, req.params.id))
      .returning();

    if (!teacher) {
      res.status(404).json({ error: "Teacher not found" });
      return;
    }
    res.json(teacher);
  } catch (err) {
    req.log.error(err, "Failed to update teacher");
    res.status(500).json({ error: "Failed to update teacher" });
  }
});

router.delete("/teachers/:id", async (req, res) => {
  try {
    const [deleted] = await db
      .delete(teachersTable)
      .where(eq(teachersTable.id, req.params.id))
      .returning();

    if (!deleted) {
      res.status(404).json({ error: "Teacher not found" });
      return;
    }
    res.json({ success: true, message: "Teacher deleted successfully" });
  } catch (err) {
    req.log.error(err, "Failed to delete teacher");
    res.status(500).json({ error: "Failed to delete teacher" });
  }
});

export default router;
