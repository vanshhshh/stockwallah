import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../lib/prisma.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const page = Math.max(Number(req.query.page || 1), 1);
    const pageSize = Math.min(Math.max(Number(req.query.pageSize || 25), 1), 100);
    const q = String(req.query.q || "").trim();
    const status = String(req.query.status || "").trim();

    const where = {
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" as const } },
              { email: { contains: q, mode: "insensitive" as const } },
              { phone: { contains: q, mode: "insensitive" as const } },
            ],
          }
        : {}),
      ...(status ? { status } : {}),
    };

    const [leads, total] = await Promise.all([
      prisma.lead.findMany({ where, orderBy: { createdAt: "desc" }, skip: (page - 1) * pageSize, take: pageSize }),
      prisma.lead.count({ where }),
    ]);

    res.json({ leads, pagination: { page, pageSize, total } });
  } catch (error) {
    next(error);
  }
});

router.get("/export", async (_req, res, next) => {
  try {
    const leads = await prisma.lead.findMany({ orderBy: { createdAt: "desc" } });
    const csv = [
      ["Name", "Phone", "Email", "Source", "Status", "Date"].join(","),
      ...leads.map((lead) =>
        [lead.name, lead.phone, lead.email, lead.source, lead.status, lead.createdAt.toISOString()]
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(","),
      ),
    ].join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="stockwallah-leads-${new Date().toISOString().slice(0, 10)}.csv"`);
    res.send(csv);
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const payload = z
      .object({
        status: z.enum(["new", "contacted", "enrolled"]).optional(),
        notes: z.string().optional(),
      })
      .parse(req.body);

    const lead = await prisma.lead.update({ where: { id }, data: payload });
    res.json({ lead });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    await prisma.lead.delete({ where: { id: Number(req.params.id) } });
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

export default router;

