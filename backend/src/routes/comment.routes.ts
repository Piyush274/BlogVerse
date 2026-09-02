import { Router } from "express";
import {
  getCommentsByArticle,
  createComment,
  deleteComment,
} from "../controllers/comment.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router({ mergeParams: true });

// Mounted under /api/articles/:articleId/comments AND /api/comments
router.get("/:articleId/comments", getCommentsByArticle);
router.post("/:articleId/comments", requireAuth, createComment);
router.delete("/comments/:id", requireAuth, deleteComment);

export default router;
