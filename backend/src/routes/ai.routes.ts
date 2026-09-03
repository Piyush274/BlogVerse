import { Router } from "express";
import {
  generateEditorialStream,
  generateEditorial,
  chatWithArticle,
  getArticleSummary,
  getDebateSummary,
  getDiscussionStarter,
  semanticSearch,
} from "../controllers/ai.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// Multi-Agent Editorial Suite
router.post("/generate-article-stream", requireAuth, generateEditorialStream);
router.post("/generate-article", requireAuth, generateEditorial);

// Article RAG & Reader Chat
router.post("/articles/:id/chat", chatWithArticle);
router.get("/articles/:id/summary", getArticleSummary);
router.post("/search/semantic", semanticSearch);

// Comment Debate & Discussion Insights
router.get("/articles/:id/debate-summary", getDebateSummary);
router.get("/articles/:id/discussion-starter", getDiscussionStarter);

export default router;
