import { Router, type IRouter } from "express";
import { and, eq, ilike, or, sql } from "drizzle-orm";
import { db, studentsTable } from "@workspace/db";
import { CreateStudentBody, UpdateStudentBody } from "@workspace/api-zod";

const router: IRouter = Router();

function generateStudentId(count: number): string {
  const year = new Date().getFullYear();
  const num = String(count + 1).padStart(3, "0");
  return `STU-${year}-${num}`;
}

router.get("/students", async (req, res) => {
  try {
    const { search, className, section } = req.query as {
      search?: string;
      className?: string;
      section?: string;
    };

    const conditions = [];
    if (search) {
      conditions.push(
        or(
          ilike(studentsTable.fullName, `%${search}%`),
          ilike(studentsTable.id, `%${search}%`),
        ),
      );
    }
    if (className) conditions.push(eq(studentsTable.className, className));
    if (section) conditions.push(eq(studentsTable.section, section));

    const students =
      conditions.length > 0
        ? await db
            .select()
            .from(studentsTable)
            .where(conditions.length === 1 ? conditions[0] : and(...conditions))
            .orderBy(studentsTable.createdAt)
        : await db.select().from(studentsTable).orderBy(studentsTable.createdAt);

    res.json(students);
  } catch (err) {
    req.log.error(err, "Failed to list students");
    res.status(500).json({ error: "Failed to list students" });
  }
});

router.post("/students", async (req, res) => {
  try {
    const parsed = CreateStudentBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Validation failed: missing required fields" });
      return;
    }

    const all = await db
      .select({ count: sql<number>`count(*)` })
      .from(studentsTable);
    const count = Number(all[0]?.count ?? 0);
    const id = generateStudentId(count);

    const [student] = await db
      .insert(studentsTable)
      .values({ id, ...parsed.data })
      .returning();

    res.status(201).json(student);
  } catch (err) {
    req.log.error(err, "Failed to create student");
    res.status(500).json({ error: "Failed to create student" });
  }
});

router.get("/students/:id", async (req, res) => {
  try {
    const [student] = await db
      .select()
      .from(studentsTable)
      .where(eq(studentsTable.id, req.params.id));

    if (!student) {
      res.status(404).json({ error: "Student not found" });
      return;
    }
    res.json(student);
  } catch (err) {
    req.log.error(err, "Failed to get student");
    res.status(500).json({ error: "Failed to get student" });
  }
});

router.put("/students/:id", async (req, res) => {
  try {
    const parsed = UpdateStudentBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Validation failed" });
      return;
    }

    const [student] = await db
      .update(studentsTable)
      .set(parsed.data)
      .where(eq(studentsTable.id, req.params.id))
      .returning();

    if (!student) {
      res.status(404).json({ error: "Student not found" });
      return;
    }
    res.json(student);
  } catch (err) {
    req.log.error(err, "Failed to update student");
    res.status(500).json({ error: "Failed to update student" });
  }
});

router.delete("/students/:id", async (req, res) => {
  try {
    const [deleted] = await db
      .delete(studentsTable)
      .where(eq(studentsTable.id, req.params.id))
      .returning();

    if (!deleted) {
      res.status(404).json({ error: "Student not found" });
      return;
    }
    res.json({ success: true, message: "Student deleted successfully" });
  } catch (err) {
    req.log.error(err, "Failed to delete student");
    res.status(500).json({ error: "Failed to delete student" });
  }
});

export default router;
