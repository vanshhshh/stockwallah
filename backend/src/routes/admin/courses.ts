import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../lib/prisma.js";

const router = Router();

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

router.get("/", async (_req, res, next) => {
  try {
    const courses = await prisma.course.findMany({ orderBy: { id: "asc" } });
    res.json({ courses });
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const payload = z
      .object({
        title: z.string().min(2),
        slug: z.string().min(2).optional(),
        category: z.string().min(2).default("Online Course"),
        level: z.string().min(2).default("Online"),
        duration: z.string().min(2).default("Online access"),
        mode: z.string().min(2).default("Online"),
        price: z.coerce.number().int().nonnegative(),
        originalPrice: z.coerce.number().int().nonnegative().nullable().optional(),
        description: z.string().min(2),
        thumbnail: z.string().optional(),
        enrollmentCount: z.coerce.number().int().nonnegative().default(0),
        rating: z.coerce.number().min(0).max(5).default(4.8),
        active: z.boolean().default(true),
      })
      .parse(req.body);

    const baseSlug = slugify(payload.slug || payload.title);
    let slug = baseSlug;
    let suffix = 2;
    while (await prisma.course.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${suffix}`;
      suffix += 1;
    }

    const course = await prisma.course.create({
      data: {
        ...payload,
        slug,
        originalPrice: payload.originalPrice ?? payload.price,
        thumbnail: payload.thumbnail || "/pankaj-yadav-founder-new.png",
        curriculum: [],
        learnings: [],
        faqs: [],
      },
    });
    res.status(201).json({ course });
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
        thumbnail: z.string().optional(),
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
