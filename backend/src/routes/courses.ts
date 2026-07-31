import { Router } from "express";
import type { Course as DbCourse } from "@prisma/client";
import { prisma } from "../lib/prisma.js";

const router = Router();

function toPublicCourse(course: DbCourse) {
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
    image: course.thumbnail || "/pankaj-yadav-founder-new.png",
    rating: Number(course.rating),
    students: course.enrollmentCount,
    lessons: Array.isArray(course.curriculum) ? course.curriculum.length : 0,
  };
}

router.get("/", async (_req, res, next) => {
  try {
    const courses = await prisma.course.findMany({
      where: { active: true },
      orderBy: [{ price: "asc" }, { id: "asc" }],
    });
    res.json({ courses: courses.map(toPublicCourse) });
  } catch (error) {
    next(error);
  }
});

export default router;
