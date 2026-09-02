"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { CheckIcon, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { loadStripe } from '@stripe/stripe-js';
import { createCheckoutSession } from "@/actions/stripe-actions";
import { useState } from "react";
import { toast } from "sonner";
import { useUser, useClerk } from "@clerk/nextjs";

const getStripe = () => {
  const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  if (!key) return null;
  return loadStripe(key);
};

const pricingPlans = [
  {
    level: "Starter",
    price: "Free",
    description: "Perfect for beginners",
    features: [
      "Access to basic articles",
      "Community access",
      "Weekly newsletter",
    ],
    highlight: false,
    action: "free",
  },
  {
    level: "Pro",
    price: "₹499/month",
    description: "For regular readers",
    features: [
      "Unlimited premium articles",
      "Early access to content",
      "Ad-free experience",
      "Download articles",
      "Personalized recommendations",
    ],
    highlight: true,
    action: "pro",
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID! // Add to your .env
  },
  {
    level: "Enterprise",
    price: "₹999/month",
    description: "For professionals",
    features: [
      "All Pro features",
      "Access to research papers",
      "Priority support",
      "Expert Q&A sessions",
      "Advanced analytics",
      "Team sharing",
    ],
    highlight: false,
    dark: true,
    action: "enterprise",
    priceId: process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID! // Add to your .env
  },
];

export function PricingSection() {
  const router = useRouter();
  const { isSignedIn } = useUser();
  const { openSignIn } = useClerk();
  const [loading, setLoading] = useState<string | null>(null);

  const handlePlanSelect = async (plan: typeof pricingPlans[0]) => {
    if (plan.action === "free") {
      router.push("/dashboard/articles/create");
      return;
    }

    if (!isSignedIn) {
      toast.info("Please sign in or create an account to upgrade your plan.");
      openSignIn();
      return;
    }

    setLoading(plan.level);
    
    try {
      // Create Stripe checkout session
      const sessionId = await createCheckoutSession(plan.priceId!);
      
      if (!sessionId) {
        throw new Error("Failed to create checkout session");
      }

      const stripe = await getStripe();
      
      if (!stripe) {
        throw new Error("Stripe failed to initialize. Please check your publishable key.");
      }

      // Redirect to Stripe checkout
      const { error } = await stripe.redirectToCheckout({ 
        sessionId 
      });
      
      if (error) {
        toast.error("Payment failed", {
          description: error.message || "An error occurred during payment processing"
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Payment failed", {
        description: error instanceof Error ? error.message : "An unexpected error occurred"
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold tracking-tight">
          Plan and Pricing
        </h2>
        <p className="mt-2 text-lg text-muted-foreground">
          Choose the plan that fits your reading habits
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {pricingPlans.map((plan) => {
          const isPro = plan.level === "Pro";
          const isEnterprise = plan.level === "Enterprise";
          const isLoading = loading === plan.level;

          return (
            <Card
              key={plan.level}
              className={`flex flex-col justify-between w-full ${
                isEnterprise
                  ? "bg-[#1c1c1c] text-white"
                  : "border border-border shadow-sm"
              } ${isPro ? "ring-2 ring-orange-500/50 border-orange-600" : ""}`}
            >
              <CardHeader className="flex justify-between items-start">
                <CardTitle>{plan.level}</CardTitle>
                {isPro && (
                  <Badge className="rounded-full bg-orange-600">🔥 Popular</Badge>
                )}
              </CardHeader>

              <CardContent className="space-y-4 flex-1">
                <div className="text-3xl font-bold">{plan.price}</div>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
                <ul className="space-y-3 mt-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <CheckIcon className="h-4 w-4 text-green-500 mt-1" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button
                  variant={isEnterprise ? "default" : isPro ? "default" : "outline"}
                  className={`w-full ${
                    isEnterprise ? "text-black bg-white hover:bg-white/90" : ""
                  }`}
                  onClick={() => handlePlanSelect(plan)}
                  disabled={!!loading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    `Get started with ${plan.level}`
                  )}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </section>
  );
}