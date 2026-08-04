import { Router } from "express";
import { prisma } from "../lib/prisma.js";

const router = Router();

const publicSettingKeys = [
  "announcementText",
  "whatsappNumber",
  "youtubeChannelId",
  "youtubeUrl",
  "linkedinUrl",
  "instagramUrl",
  "facebookUrl",
  "telegramUrl",
  "playStoreUrl",
  "appStoreUrl",
  "adminEmail",
  "contactEmail",
  "address",
  "mapLink",
  "logoImage",
  "homeHeroImage",
  "founderImage",
  "anshulImage",
  "deepAryaImage",
  "upiQrImage",
  "courseFallbackImage",
];

router.get("/public", async (_req, res, next) => {
  try {
    const settings = await prisma.siteSetting.findMany({
      where: { key: { in: publicSettingKeys } },
    });
    res.json({
      settings: Object.fromEntries(settings.map((setting) => [setting.key, setting.value])),
    });
  } catch (error) {
    next(error);
  }
});

export default router;
