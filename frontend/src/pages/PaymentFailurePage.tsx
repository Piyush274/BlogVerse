import { Button } from "@/components/ui/button";
import { XCircle, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/home/Navbar";
import { Footer } from "@/components/home/Footer";

export default function PaymentFailurePage() {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Navbar />
      <section className="relative flex-1 overflow-hidden py-24 flex items-center justify-center">
        <div className="mx-auto max-w-xl px-6 text-center">
          <XCircle className="mx-auto h-16 w-16 text-destructive mb-6" />

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Payment Cancelled or Failed
          </h1>

          <p className="text-muted-foreground mb-8">
            The payment process could not be completed. Your account has not been charged.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/">
              <Button className="gap-2">
                <ArrowLeft className="h-4 w-4" /> Return to Home
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="outline">Go to Dashboard</Button>
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
