import { Router } from "express";
import { getYoutubeStatus } from "../services/youtubeService.js";

const router = Router();

router.get("/status", async (_req, res, next) => {
  try {
    res.json(await getYoutubeStatus());
  } catch (error) {
    next(error);
  }
});

export default router;

