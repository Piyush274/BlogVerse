import { Router } from "express";
import {
  createCheckoutSession,
  handleWebhook,
} from "../controllers/payment.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// /api/payments
router.post("/create-checkout-session", requireAuth, createCheckoutSession);
router.post("/webhook", handleWebhook);

export default router;
