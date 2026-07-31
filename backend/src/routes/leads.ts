import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { sendAdminNotification } from "../services/emailService.js";

const router = Router();

const leadSchema = z.object({
  name: z.string().trim().min(2),
  phone: z.string().trim().min(10).max(16),
  email: z.string().trim().email(),
  source: z.string().trim().default("popup"),
  timestamp: z.string().optional(),
});

router.post("/", async (req, res, next) => {
  try {
    const payload = leadSchema.parse(req.body);
    const lead = await prisma.lead.create({
      data: {
        name: payload.name,
        phone: payload.phone,
        email: payload.email,
        source: payload.source,
      },
    });

    await sendAdminNotification("New StockWallah lead", {
      Name: lead.name,
      Phone: lead.phone,
      Email: lead.email,
      Source: lead.source,
      Time: payload.timestamp || lead.createdAt.toISOString(),
    });

    res.status(201).json({ lead });
  } catch (error) {
    next(error);
  }
});

export default router;

