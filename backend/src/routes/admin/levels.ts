import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../lib/prisma.js";

const router = Router();

const levelSchema = z.object({
  date: z.string(),
  symbol: z.string().default("NIFTY"),
  levelPrice: z.coerce.number(),
  levelType: z.enum(["Support", "Resistance", "Strong Support", "Strong Resistance", "CPR"]),
  targetPrice: z.coerce.number().optional().nullable(),
  stoplossPrice: z.coerce.number().optional().nullable(),
  notes: z.string().optional().nullable(),
  isHit: z.boolean().optional(),
  hitType: z.enum(["target", "stoploss"]).optional().nullable(),
  hitTime: z.string().optional().nullable(),
});

function toDate(date: string) {
  return new Date(`${date.slice(0, 10)}T00:00:00.000Z`);
}

function serialize(level: Awaited<ReturnType<typeof prisma.tradingLevel.findMany>>[number]) {
  return {
    ...level,
    levelPrice: Number(level.levelPrice),
    targetPrice: level.targetPrice == null ? null : Number(level.targetPrice),
    stoplossPrice: level.stoplossPrice == null ? null : Number(level.stoplossPrice),
  };
}

router.get("/", async (req, res, next) => {
  try {
    const date = String(req.query.date || new Date().toISOString().slice(0, 10));
    const symbol = String(req.query.symbol || "NIFTY").toUpperCase();
    const levels = await prisma.tradingLevel.findMany({ where: { date: toDate(date), symbol }, orderBy: { levelPrice: "desc" } });
    res.json({ levels: levels.map(serialize) });
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const payload = levelSchema.parse(req.body);
    const level = await prisma.tradingLevel.create({
      data: {
        date: toDate(payload.date),
        symbol: payload.symbol.toUpperCase(),
        levelPrice: payload.levelPrice,
        levelType: payload.levelType,
        targetPrice: payload.targetPrice,
        stoplossPrice: payload.stoplossPrice,
        notes: payload.notes,
        isHit: payload.isHit,
        hitType: payload.hitType,
        hitTime: payload.hitTime ? new Date(payload.hitTime) : null,
      },
    });
    res.status(201).json({ level: serialize(level) });
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const payload = levelSchema.partial().parse(req.body);
    const level = await prisma.tradingLevel.update({
      where: { id: Number(req.params.id) },
      data: {
        ...(payload.date ? { date: toDate(payload.date) } : {}),
        ...(payload.symbol ? { symbol: payload.symbol.toUpperCase() } : {}),
        ...(payload.levelPrice !== undefined ? { levelPrice: payload.levelPrice } : {}),
        ...(payload.levelType ? { levelType: payload.levelType } : {}),
        ...(payload.targetPrice !== undefined ? { targetPrice: payload.targetPrice } : {}),
        ...(payload.stoplossPrice !== undefined ? { stoplossPrice: payload.stoplossPrice } : {}),
        ...(payload.notes !== undefined ? { notes: payload.notes } : {}),
        ...(payload.isHit !== undefined ? { isHit: payload.isHit } : {}),
        ...(payload.hitType !== undefined ? { hitType: payload.hitType } : {}),
        ...(payload.hitTime !== undefined ? { hitTime: payload.hitTime ? new Date(payload.hitTime) : null } : {}),
      },
    });
    res.json({ level: serialize(level) });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    await prisma.tradingLevel.delete({ where: { id: Number(req.params.id) } });
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

export default router;

