import { Router } from "express";
import {
  getDashboardStats,
  getUserArticles,
} from "../controllers/dashboard.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// /api/dashboard
router.get("/stats", requireAuth, getDashboardStats);
router.get("/my-articles", requireAuth, getUserArticles);

export default router;
