import { Router } from "express";
import { getGainersLosers, getIntradayChart, getMarketOverview, getSectorPerformance } from "../services/marketService.js";

const router = Router();

router.get("/overview", async (_req, res, next) => {
  try {
    res.json(await getMarketOverview());
  } catch (error) {
    next(error);
  }
});

router.get("/gainers-losers", async (_req, res, next) => {
  try {
    res.json(await getGainersLosers());
  } catch (error) {
    next(error);
  }
});

router.get("/chart", async (req, res, next) => {
  try {
    res.json(await getIntradayChart(String(req.query.symbol || "NIFTY"), String(req.query.interval || "5m")));
  } catch (error) {
    if (error && typeof error === "object" && "status" in error && error.status === 400) {
      return res.status(400).json({ error: error instanceof Error ? error.message : "Bad request" });
    }
    next(error);
  }
});

router.get("/sectors", async (_req, res, next) => {
  try {
    res.json(await getSectorPerformance());
  } catch (error) {
    next(error);
  }
});

export default router;

