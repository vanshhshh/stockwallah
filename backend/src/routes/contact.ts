import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { sendAdminNotification } from "../services/emailService.js";

const router = Router();

const contactSchema = z.object({
  name: z.string().trim().min(2),
  email: z.string().trim().email(),
  phone: z.string().trim().optional(),
  courseInterest: z.string().trim().optional(),
  message: z.string().trim().min(10),
});

router.post("/", async (req, res, next) => {
  try {
    const payload = contactSchema.parse(req.body);
    const message = await prisma.contactMessage.create({ data: payload });
    await sendAdminNotification("New StockWallah contact message", {
      Name: payload.name,
      Email: payload.email,
      Phone: payload.phone,
      Course: payload.courseInterest,
      Message: payload.message,
    });
    res.status(201).json({ message });
  } catch (error) {
    next(error);
  }
});

export default router;

