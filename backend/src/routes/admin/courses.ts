import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../lib/prisma.js";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    const courses = await prisma.course.findMany({ orderBy: { id: "asc" } });
    res.json({ courses });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", async (req, res, next) => {
  try {
    const payload = z
      .object({
        active: z.boolean().optional(),
        title: z.string().min(2).optional(),
        category: z.string().min(2).optional(),
        level: z.string().min(2).optional(),
        duration: z.string().min(2).optional(),
        mode: z.string().min(2).optional(),
        price: z.coerce.number().optional(),
        originalPrice: z.coerce.number().nullable().optional(),
        description: z.string().optional(),
        enrollmentCount: z.coerce.number().optional(),
      })
      .parse(req.body);
    const course = await prisma.course.update({ where: { id: Number(req.params.id) }, data: payload });
    res.json({ course });
  } catch (error) {
    next(error);
  }
});

export default router;
