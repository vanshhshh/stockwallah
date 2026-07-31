import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../lib/prisma.js";

const router = Router();
const uploadDir = path.resolve(process.cwd(), "uploads");

const uploadSchema = z.object({
  title: z.string().min(2),
  imageData: z.string().min(32),
  linkUrl: z.string().url().optional().or(z.literal("")),
});

async function saveBase64Image(imageData: string) {
  const match = imageData.match(/^data:(image\/(?:png|jpeg|jpg|webp));base64,(.+)$/);
  if (!match) throw new Error("Invalid image data");

  const ext = match[1].includes("png") ? "png" : match[1].includes("webp") ? "webp" : "jpg";
  const fileName = `${randomUUID()}.${ext}`;
  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, fileName), Buffer.from(match[2], "base64"));
  return `/uploads/${fileName}`;
}

router.get("/", async (_req, res, next) => {
  try {
    const [images, banners] = await Promise.all([
      prisma.galleryImage.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.banner.findMany({ orderBy: { createdAt: "desc" } }),
    ]);
    res.json({ images, banners });
  } catch (error) {
    next(error);
  }
});

router.post("/images", async (req, res, next) => {
  try {
    const payload = uploadSchema.parse(req.body);
    const imageUrl = await saveBase64Image(payload.imageData);
    const image = await prisma.galleryImage.create({ data: { title: payload.title, imageUrl } });
    res.status(201).json({ image });
  } catch (error) {
    next(error);
  }
});

router.post("/banners", async (req, res, next) => {
  try {
    const payload = uploadSchema.parse(req.body);
    const imageUrl = await saveBase64Image(payload.imageData);
    const banner = await prisma.banner.create({
      data: { title: payload.title, imageUrl, linkUrl: payload.linkUrl || null },
    });
    res.status(201).json({ banner });
  } catch (error) {
    next(error);
  }
});

router.patch("/images/:id", async (req, res, next) => {
  try {
    const payload = z.object({ active: z.boolean().optional(), title: z.string().min(2).optional() }).parse(req.body);
    const image = await prisma.galleryImage.update({ where: { id: Number(req.params.id) }, data: payload });
    res.json({ image });
  } catch (error) {
    next(error);
  }
});

router.patch("/banners/:id", async (req, res, next) => {
  try {
    const payload = z.object({ active: z.boolean().optional(), title: z.string().min(2).optional(), linkUrl: z.string().url().nullable().optional() }).parse(req.body);
    const banner = await prisma.banner.update({ where: { id: Number(req.params.id) }, data: payload });
    res.json({ banner });
  } catch (error) {
    next(error);
  }
});

router.delete("/images/:id", async (req, res, next) => {
  try {
    await prisma.galleryImage.delete({ where: { id: Number(req.params.id) } });
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

router.delete("/banners/:id", async (req, res, next) => {
  try {
    await prisma.banner.delete({ where: { id: Number(req.params.id) } });
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

export default router;
