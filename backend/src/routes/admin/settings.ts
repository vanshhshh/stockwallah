import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../lib/prisma.js";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    const [settings, schedule] = await Promise.all([
      prisma.siteSetting.findMany({ orderBy: { key: "asc" } }),
      prisma.youtubeSchedule.findMany({ orderBy: { scheduledAt: "asc" }, take: 20 }),
    ]);
    res.json({
      settings: Object.fromEntries(settings.map((setting) => [setting.key, setting.value])),
      schedule,
    });
  } catch (error) {
    next(error);
  }
});

router.put("/", async (req, res, next) => {
  try {
    const payload = z.record(z.string()).parse(req.body.settings || req.body);
    const updates = await Promise.all(
      Object.entries(payload).map(([key, value]) =>
        prisma.siteSetting.upsert({
          where: { key },
          update: { value },
          create: { key, value },
        }),
      ),
    );
    res.json({ settings: Object.fromEntries(updates.map((setting) => [setting.key, setting.value])) });
  } catch (error) {
    next(error);
  }
});

router.post("/youtube-schedule", async (req, res, next) => {
  try {
    const payload = z
      .object({
        title: z.string().min(2),
        scheduledAt: z.string(),
        youtubeLink: z.string().url().optional().nullable(),
        isLive: z.boolean().optional(),
      })
      .parse(req.body);
    const schedule = await prisma.youtubeSchedule.create({
      data: {
        title: payload.title,
        scheduledAt: new Date(payload.scheduledAt),
        youtubeLink: payload.youtubeLink,
        isLive: payload.isLive,
      },
    });
    res.status(201).json({ schedule });
  } catch (error) {
    next(error);
  }
});

export default router;
