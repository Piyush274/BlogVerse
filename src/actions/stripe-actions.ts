'use server';

import Stripe from 'stripe';
import { auth, currentUser } from '@clerk/nextjs/server';

export async function createCheckoutSession(priceId: string) {
  try {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      throw new Error("STRIPE_SECRET_KEY is not configured.");
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: '2025-05-28.basil' as any,
    });
    const { userId } = await auth();
    if (!userId) {
      throw new Error("You must be logged in to subscribe to a plan.");
    }

    const clerkUser = await currentUser();
    const userEmail = clerkUser?.emailAddresses[0]?.emailAddress;

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      client_reference_id: userId,
      customer_email: userEmail,
      metadata: {
        userId: userId,
        clerkUserId: userId,
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/failure`,
    });

    return session.id;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}