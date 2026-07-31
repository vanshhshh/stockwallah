import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { sendAdminNotification } from "../services/emailService.js";

const router = Router();

const enrollmentSchema = z.object({
  name: z.string().trim().min(2),
  email: z.string().trim().email(),
  phone: z.string().trim().min(10),
  city: z.string().trim().optional(),
  course: z.string().trim().min(2),
  mode: z.enum(["online", "offline", "both"]).or(z.string().trim().min(2)),
  experience: z.string().trim().optional(),
  query: z.string().trim().optional(),
});

router.post("/", async (req, res, next) => {
  try {
    const payload = enrollmentSchema.parse(req.body);
    const enrollment = await prisma.enrollment.create({ data: payload });
    await sendAdminNotification("New StockWallah enrollment", {
      Name: payload.name,
      Email: payload.email,
      Phone: payload.phone,
      Course: payload.course,
      Mode: payload.mode,
      City: payload.city,
    });
    res.status(201).json({ enrollment });
  } catch (error) {
    next(error);
  }
});

export default router;

