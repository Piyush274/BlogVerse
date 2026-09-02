import { Request, Response } from "express";
import { stripe } from "../config/stripe.js";

/**
 * POST /api/payments/create-checkout-session
 */
export async function createCheckoutSession(req: Request, res: Response): Promise<void> {
  try {
    if (!stripe) {
      res.status(500).json({ error: "Stripe is not configured on the server." });
      return;
    }

    if (!req.user) {
      res.status(401).json({ error: "You must be logged in to subscribe." });
      return;
    }

    const { priceId } = req.body;
    if (!priceId) {
      res.status(400).json({ error: "Price ID is required." });
      return;
    }

    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      client_reference_id: req.user._id.toString(),
      customer_email: req.user.email,
      metadata: {
        userId: req.user._id.toString(),
        email: req.user.email,
      },
      success_url: `${clientUrl}/payment/success`,
      cancel_url: `${clientUrl}/payment/failure`,
    });

    res.json({ id: session.id, url: session.url });
  } catch (error: any) {
    console.error("[Stripe Session Error]:", error);
    res.status(500).json({ error: error.message || "Failed to create checkout session." });
  }
}

/**
 * POST /api/payments/webhook
 */
export async function handleWebhook(req: Request, res: Response): Promise<void> {
  try {
    if (!stripe) {
      res.status(500).json({ error: "Stripe is not configured." });
      return;
    }

    const sig = req.headers["stripe-signature"];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    if (endpointSecret && sig) {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } else {
      event = req.body;
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        console.log(`[Stripe Webhook] Payment succeeded for customer: ${session.customer_email}`);
        break;
      }
      default:
        console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error: any) {
    console.error("[Stripe Webhook Error]:", error.message);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
}
