import { Router } from "express";
import { getLikesByArticle, toggleLike } from "../controllers/like.controller.js";
import { requireAuth, optionalAuth } from "../middleware/auth.js";

const router = Router();

// /api/articles/:articleId/likes
router.get("/:articleId/likes", optionalAuth, getLikesByArticle);
router.post("/:articleId/likes/toggle", requireAuth, toggleLike);

export default router;
