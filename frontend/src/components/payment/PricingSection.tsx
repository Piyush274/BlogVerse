import React, { useState } from "react";
import { Check, Sparkles, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createCheckoutSession } from "@/api/payments.api";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function PricingSection() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleSubscribe = async (planType: string, priceId: string) => {
    if (!user) {
      toast.info("Please sign in to choose a subscription plan");
      navigate("/sign-in");
      return;
    }

    if (planType === "Starter") {
      navigate("/dashboard/articles/create");
      return;
    }

    setLoadingPlan(planType);
    try {
      const data = await createCheckoutSession(priceId);
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to initiate payment.");
    } finally {
      setLoadingPlan(null);
    }
  };

  const PRO_PRICE_ID = import.meta.env.VITE_STRIPE_PRO_PRICE_ID || "price_pro_default";
  const ENTERPRISE_PRICE_ID = import.meta.env.VITE_STRIPE_ENTERPRISE_PRICE_ID || "price_enterprise_default";

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center space-y-4 mb-16">
        <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
          <Sparkles className="h-3.5 w-3.5" /> Simple & Transparent Pricing
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
          Supercharge Your Writing Workflow
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg">
          Choose a plan that fits your ambition. Upgrade or cancel at any time.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Starter Plan */}
        <Card className="flex flex-col justify-between border hover:border-primary/50 transition-all rounded-2xl p-6 bg-card/60 backdrop-blur-md shadow-sm">
          <div>
            <CardHeader className="p-0 pb-4">
              <CardTitle className="text-xl font-bold">Starter</CardTitle>
              <CardDescription>Perfect for beginners exploring the platform.</CardDescription>
            </CardHeader>
            <div className="my-4">
              <span className="text-4xl font-extrabold">$0</span>
              <span className="text-muted-foreground text-sm"> / month</span>
            </div>
            <CardContent className="p-0 space-y-3 pt-2">
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500 shrink-0" /> Up to 5 published articles
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500 shrink-0" /> Community commenting & likes
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500 shrink-0" /> Basic author dashboard
                </li>
              </ul>
            </CardContent>
          </div>
          <CardFooter className="p-0 pt-6">
            <Button
              variant="outline"
              className="w-full rounded-xl"
              onClick={() => handleSubscribe("Starter", "")}
            >
              Get Started Free
            </Button>
          </CardFooter>
        </Card>

        {/* Pro Plan */}
        <Card className="relative flex flex-col justify-between border-2 border-primary transition-all rounded-2xl p-6 bg-card/80 backdrop-blur-md shadow-xl scale-105 z-10">
          <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-purple-600 text-white shadow-md">
            Most Popular
          </Badge>
          <div>
            <CardHeader className="p-0 pb-4">
              <CardTitle className="text-xl font-bold text-foreground">Pro Creator</CardTitle>
              <CardDescription>For serious writers wanting growth and tools.</CardDescription>
            </CardHeader>
            <div className="my-4">
              <span className="text-4xl font-extrabold">$12</span>
              <span className="text-muted-foreground text-sm"> / month</span>
            </div>
            <CardContent className="p-0 space-y-3 pt-2">
              <ul className="space-y-2.5 text-sm text-foreground">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary shrink-0" /> Unlimited articles & drafts
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary shrink-0" /> High-res Cloudinary images
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary shrink-0" /> Advanced analytics & word count
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary shrink-0" /> Featured article badges
                </li>
              </ul>
            </CardContent>
          </div>
          <CardFooter className="p-0 pt-6">
            <Button
              disabled={loadingPlan === "Pro"}
              className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-primary-foreground font-semibold rounded-xl shadow-md gap-2"
              onClick={() => handleSubscribe("Pro", PRO_PRICE_ID)}
            >
              {loadingPlan === "Pro" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Upgrading...
                </>
              ) : (
                <>
                  Upgrade to Pro <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

        {/* Enterprise Plan */}
        <Card className="flex flex-col justify-between border hover:border-primary/50 transition-all rounded-2xl p-6 bg-card/60 backdrop-blur-md shadow-sm">
          <div>
            <CardHeader className="p-0 pb-4">
              <CardTitle className="text-xl font-bold">Enterprise Team</CardTitle>
              <CardDescription>For content teams and multi-author publications.</CardDescription>
            </CardHeader>
            <div className="my-4">
              <span className="text-4xl font-extrabold">$49</span>
              <span className="text-muted-foreground text-sm"> / month</span>
            </div>
            <CardContent className="p-0 space-y-3 pt-2">
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500 shrink-0" /> Everything in Pro plan
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500 shrink-0" /> Multi-author collaboration
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500 shrink-0" /> Custom publication domains
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500 shrink-0" /> Priority 24/7 support
                </li>
              </ul>
            </CardContent>
          </div>
          <CardFooter className="p-0 pt-6">
            <Button
              disabled={loadingPlan === "Enterprise"}
              variant="outline"
              className="w-full rounded-xl"
              onClick={() => handleSubscribe("Enterprise", ENTERPRISE_PRICE_ID)}
            >
              {loadingPlan === "Enterprise" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Processing...
                </>
              ) : (
                "Upgrade to Enterprise"
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}
