"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import Confetti from "react-confetti";
import { useEffect, useState } from "react";

export default function PaymentSuccessPage() {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // Only runs on client
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden">
      {dimensions.width > 0 && dimensions.height > 0 && (
        <Confetti
          width={dimensions.width}
          height={dimensions.height}
          gravity={0.1}
          style={{ zIndex: 99 }}
          numberOfPieces={700}
          recycle={false}
        />
      )}

      {/* Background */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary opacity-20 blur-[100px]"></div>
      </div>

      <div className="mx-auto max-w-7xl px-6 pt-32 pb-16 sm:pt-40 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="flex items-center justify-center gap-x-2 rounded-full bg-accent px-4 py-2 text-xs font-medium w-fit mx-auto mb-6">
            <Sparkles className="h-4 w-4 text-primary" />
            <span>Welcome to BlogVerse Pro</span>
          </div>

          <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-6" />

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
            Payment Successful!
          </h1>

          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            You've successfully subscribed to the purchased plan
          </p>

          <p className="mt-4 text-muted-foreground">
            Thank you for upgrading your BlogVerse experience. Your account has been upgraded.
          </p>

          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link href="/dashboard/articles/create">
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 group"
              >
                Start Writing
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>

            <Link href="/dashboard">
              <Button variant="outline" size="lg">
                Go to Dashboard
              </Button>
            </Link>
          </div>

          <div className="mt-16 border-t border-border pt-8">
            <h3 className="text-sm font-medium text-muted-foreground mb-4">
              What's next?
            </h3>
            <ul className="space-y-3 text-sm text-muted-foreground max-w-md mx-auto">
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Immediate access to all premium features</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Receipt sent to your email</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Manage your subscription in account settings</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
