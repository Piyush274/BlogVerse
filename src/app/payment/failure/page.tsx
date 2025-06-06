"use client";

import { Button } from "@/components/ui/button";
import { XCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PaymentFailedPage() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6">
      {/* Background grid pattern */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-red-500 opacity-20 blur-[100px]"></div>
      </div>

      <div className="max-w-md text-center">
        <XCircle className="mx-auto h-16 w-16 text-red-500 mb-6" />

        <h1 className="text-3xl sm:text-4xl font-bold mb-4">
          Payment Failed
        </h1>

        <p className="text-muted-foreground mb-4">
          Oops! Something went wrong while processing your payment.
        </p>

        <p className="text-muted-foreground mb-8">
          Please try again or contact support if the issue persists.
        </p>

        <div className="flex justify-center gap-4">
          <Link href="/">
            <Button size="lg">
              Try Again
            </Button>
          </Link>

          <Link href="/dashboard">
            <Button size="lg" variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
