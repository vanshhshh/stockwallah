import { Router } from "express";
import { prisma } from "../../lib/prisma.js";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    const contacts = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });
    res.json({ contacts });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id/read", async (req, res, next) => {
  try {
    const contact = await prisma.contactMessage.update({ where: { id: Number(req.params.id) }, data: { isRead: true } });
    res.json({ contact });
  } catch (error) {
    next(error);
  }
});

export default router;

