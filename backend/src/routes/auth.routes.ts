import { Router } from "express";
import {
  register,
  login,
  getMe,
} from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected routes
router.get("/me", requireAuth, getMe);

export default router;
