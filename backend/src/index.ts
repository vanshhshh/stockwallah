import "dotenv/config";
import express, { type NextFunction, type Request, type Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { ZodError } from "zod";
import leadsRouter from "./routes/leads.js";
import contactRouter from "./routes/contact.js";
import enrollmentsRouter from "./routes/enrollments.js";
import newsRouter from "./routes/news.js";
import marketRouter from "./routes/market.js";
import levelsRouter from "./routes/levels.js";
import youtubeRouter from "./routes/youtube.js";
import settingsRouter from "./routes/settings.js";
import galleryRouter from "./routes/gallery.js";
import coursesRouter from "./routes/courses.js";
import adminAuthRouter from "./routes/admin/auth.js";
import adminDashboardRouter from "./routes/admin/dashboard.js";
import adminLeadsRouter from "./routes/admin/leads.js";
import adminEnrollmentsRouter from "./routes/admin/enrollments.js";
import adminLevelsRouter from "./routes/admin/levels.js";
import adminContactsRouter from "./routes/admin/contacts.js";
import adminSettingsRouter from "./routes/admin/settings.js";
import adminCoursesRouter from "./routes/admin/courses.js";
import adminGalleryRouter from "./routes/admin/gallery.js";
import { requireAdmin } from "./middleware/auth.js";
import { contactLimiter, leadLimiter } from "./middleware/rateLimiter.js";
import { logger } from "./lib/logger.js";

const app = express();
const port = Number(process.env.PORT || 4000);
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);
app.use(
  cors({
    origin: [frontendUrl, "http://localhost:3000", "http://127.0.0.1:3000"],
    credentials: true,
  }),
);
app.use(express.json({ limit: "12mb" }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use("/uploads", express.static(path.resolve(process.cwd(), "uploads")));

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "stockwallah-api", timestamp: new Date().toISOString() });
});

app.use("/api/leads", leadLimiter, leadsRouter);
app.use("/api/contact", contactLimiter, contactRouter);
app.use("/api/enrollments", contactLimiter, enrollmentsRouter);
app.use("/api/news", newsRouter);
app.use("/api/market", marketRouter);
app.use("/api/levels", levelsRouter);
app.use("/api/youtube", youtubeRouter);
app.use("/api/settings", settingsRouter);
app.use("/api/gallery", galleryRouter);
app.use("/api/courses", coursesRouter);

app.use("/api/admin/auth", adminAuthRouter);
app.use("/api/admin/dashboard", requireAdmin, adminDashboardRouter);
app.use("/api/admin/leads", requireAdmin, adminLeadsRouter);
app.use("/api/admin/enrollments", requireAdmin, adminEnrollmentsRouter);
app.use("/api/admin/levels", requireAdmin, adminLevelsRouter);
app.use("/api/admin/contacts", requireAdmin, adminContactsRouter);
app.use("/api/admin/settings", requireAdmin, adminSettingsRouter);
app.use("/api/admin/courses", requireAdmin, adminCoursesRouter);
app.use("/api/admin/gallery", requireAdmin, adminGalleryRouter);

app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (error instanceof ZodError) {
    return res.status(400).json({ error: "Validation failed", issues: error.flatten() });
  }

  logger.error("Unhandled API error", { error: error instanceof Error ? error.stack : error });
  return res.status(500).json({ error: "Something went wrong" });
});

app.listen(port, () => {
  logger.info(`StockWallah API listening on ${port}`);
});
