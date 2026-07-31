import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../lib/prisma.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const course = String(req.query.course || "").trim();
    const where = course ? { course: { contains: course, mode: "insensitive" as const } } : {};
    const enrollments = await prisma.enrollment.findMany({ where, orderBy: { createdAt: "desc" } });
    res.json({ enrollments });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", async (req, res, next) => {
  try {
    const payload = z.object({ status: z.enum(["pending", "confirmed", "cancelled"]) }).parse(req.body);
    const enrollment = await prisma.enrollment.update({ where: { id: Number(req.params.id) }, data: payload });
    res.json({ enrollment });
  } catch (error) {
    next(error);
  }
});

export default router;

