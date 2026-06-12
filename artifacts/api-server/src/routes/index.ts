import { Router, type IRouter } from "express";
import healthRouter from "./health";
import studentsRouter from "./students";
import teachersRouter from "./teachers";
import classesRouter from "./classes";

const router: IRouter = Router();

router.use(healthRouter);
router.use(studentsRouter);
router.use(teachersRouter);
router.use(classesRouter);

export default router;
