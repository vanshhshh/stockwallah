import { Router } from "express";
import { getNews } from "../services/newsService.js";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    const articles = await getNews();
    res.json({ articles });
  } catch (error) {
    next(error);
  }
});

export default router;

