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
import { CheckIcon } from "lucide-react";

const pricingPlans = [
  {
    level: "Starter",
    price: "Free",
    description: "Perfect for beginners",
    features: [
      "Access to basic articles",
      "3 premium articles/month",
      "Community access",
      "Weekly newsletter",
    ],
    highlight: false,
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
  },
];

export function PricingSection() {
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
                >
                  Get started with {plan.level}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
