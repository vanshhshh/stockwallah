import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { logger } from "../lib/logger.js";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    const [images, banners] = await Promise.all([
      prisma.galleryImage.findMany({ where: { active: true }, orderBy: { createdAt: "desc" } }),
      prisma.banner.findMany({ where: { active: true }, orderBy: { createdAt: "desc" } }),
    ]);
    res.json({ images, banners });
  } catch (error) {
    logger.warn("Public gallery unavailable; serving empty gallery", { error: error instanceof Error ? error.message : error });
    res.json({ images: [], banners: [] });
  }
});

export default router;
