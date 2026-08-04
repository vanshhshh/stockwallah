import { Router } from "express";
import type { Course as DbCourse } from "@prisma/client";
import { prisma } from "../lib/prisma.js";

const router = Router();

function toPublicCourse(course: DbCourse, fallbackImage: string) {
  return {
    id: course.id,
    slug: course.slug,
    title: course.title,
    category: course.category,
    level: course.level,
    description: course.description,
    duration: course.duration,
    mode: course.mode,
    price: course.price,
    originalPrice: course.originalPrice ?? course.price,
    image: course.thumbnail || fallbackImage,
    rating: Number(course.rating),
    students: course.enrollmentCount,
    lessons: Array.isArray(course.curriculum) ? course.curriculum.length : 0,
  };
}

router.get("/", async (_req, res, next) => {
  try {
    const [courses, fallbackImageSetting] = await Promise.all([
      prisma.course.findMany({
        where: { active: true },
        orderBy: [{ price: "asc" }, { id: "asc" }],
      }),
      prisma.siteSetting.findUnique({ where: { key: "courseFallbackImage" } }),
    ]);
    const fallbackImage = fallbackImageSetting?.value || "/pankaj-yadav-founder-new.png";
    res.json({ courses: courses.map((course) => toPublicCourse(course, fallbackImage)) });
  } catch (error) {
    next(error);
  }
});

export default router;
