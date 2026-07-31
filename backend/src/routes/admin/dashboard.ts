import { Router } from "express";
import { prisma } from "../../lib/prisma.js";
import { getYoutubeStatus } from "../../services/youtubeService.js";

const router = Router();

function startOfDay(date = new Date()) {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function daysAgo(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

router.get("/", async (_req, res, next) => {
  try {
    const today = startOfDay();
    const [leadsToday, leadsWeek, leadsMonth, enrollments, levelsToday, contactsUnread, youtube, recentLeads] = await Promise.all([
      prisma.lead.count({ where: { createdAt: { gte: today } } }),
      prisma.lead.count({ where: { createdAt: { gte: daysAgo(7) } } }),
      prisma.lead.count({ where: { createdAt: { gte: daysAgo(30) } } }),
      prisma.enrollment.count(),
      prisma.tradingLevel.count({ where: { date: today } }),
      prisma.contactMessage.count({ where: { isRead: false } }),
      getYoutubeStatus(),
      prisma.lead.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    ]);

    res.json({
      stats: {
        leadsToday,
        leadsWeek,
        leadsMonth,
        enrollments,
        levelsStatus: levelsToday > 0 ? "published" : "not yet",
        contactsUnread,
        liveStatus: youtube.isLive ? "live" : "offline",
      },
      recentLeads,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
