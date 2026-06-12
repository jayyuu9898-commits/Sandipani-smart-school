import { Router, type IRouter } from "express";
import { eq, sql } from "drizzle-orm";
import { db, classesTable } from "@workspace/db";
import {
  CreateClassBody,
  UpdateClassBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

function generateClassId(name: string, section: string): string {
  const num = name.replace(/\D/g, "").padStart(2, "0");
  return `CLS-${num}-${section.toUpperCase()}`;
}

router.get("/classes", async (_req, res) => {
  try {
    const classes = await db.select().from(classesTable).orderBy(classesTable.createdAt);
    res.json(classes);
  } catch (err) {
    res.status(500).json({ error: "Failed to list classes" });
  }
});

router.post("/classes", async (req, res) => {
  try {
    const parsed = CreateClassBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }

    const { name, section } = parsed.data;
    let id = generateClassId(name, section);

    const existing = await db
      .select({ count: sql<number>`count(*)` })
      .from(classesTable)
      .where(eq(classesTable.id, id));

    if (Number(existing[0]?.count ?? 0) > 0) {
      const all = await db.select({ count: sql<number>`count(*)` }).from(classesTable);
      const count = Number(all[0]?.count ?? 0);
      id = `${id}-${count + 1}`;
    }

    const [cls] = await db
      .insert(classesTable)
      .values({ id, ...parsed.data })
      .returning();

    res.status(201).json(cls);
  } catch (err) {
    req.log.error(err, "Failed to create class");
    res.status(500).json({ error: "Failed to create class" });
  }
});

router.get("/classes/:id", async (req, res) => {
  try {
    const [cls] = await db
      .select()
      .from(classesTable)
      .where(eq(classesTable.id, req.params.id));

    if (!cls) {
      res.status(404).json({ error: "Class not found" });
      return;
    }
    res.json(cls);
  } catch (err) {
    res.status(500).json({ error: "Failed to get class" });
  }
});

router.put("/classes/:id", async (req, res) => {
  try {
    const parsed = UpdateClassBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }

    const [cls] = await db
      .update(classesTable)
      .set(parsed.data)
      .where(eq(classesTable.id, req.params.id))
      .returning();

    if (!cls) {
      res.status(404).json({ error: "Class not found" });
      return;
    }
    res.json(cls);
  } catch (err) {
    res.status(500).json({ error: "Failed to update class" });
  }
});

router.delete("/classes/:id", async (req, res) => {
  try {
    const [deleted] = await db
      .delete(classesTable)
      .where(eq(classesTable.id, req.params.id))
      .returning();

    if (!deleted) {
      res.status(404).json({ error: "Class not found" });
      return;
    }
    res.json({ success: true, message: "Class deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete class" });
  }
});

export default router;
