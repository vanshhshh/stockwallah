import { Router } from "express";
import { getGainersLosers, getMarketOverview } from "../services/marketService.js";

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

export default router;

