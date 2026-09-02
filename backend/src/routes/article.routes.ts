import { Router } from "express";
import {
  getArticles,
  getTopArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
} from "../controllers/article.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const router = Router();

// Public routes
router.get("/", getArticles);
router.get("/top", getTopArticles);
router.get("/:id", getArticleById);

// Protected routes
router.post("/", requireAuth, upload.single("featuredImage"), createArticle);
router.put("/:id", requireAuth, upload.single("featuredImage"), updateArticle);
router.delete("/:id", requireAuth, deleteArticle);

export default router;
