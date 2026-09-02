import Hero from "@/components/hero/hero";
import { Navbar } from "@/components/home/Navbar";
import { Footer } from "@/components/home/Footer";
import { TopArticles } from "@/components/topArticles/TopArticles";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import PricingSection from "@/components/payment/PricingSection";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        <Navbar />
        <Hero />
        <section className="relative py-14 md:py-16">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="mb-12 text-center">
              <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                Featured Articles
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Discover our most popular and trending content
              </p>
            </div>

            <TopArticles />

            <div className="mt-12 text-center">
              <Link to="/articles">
                <Button
                  variant="outline"
                  className="rounded-full px-8 py-6 text-lg hover:bg-foreground hover:text-background transition-all shadow-sm"
                >
                  View All Articles
                </Button>
              </Link>
            </div>
          </div>
        </section>
        <PricingSection />
      </div>
      <Footer />
    </div>
  );
}
