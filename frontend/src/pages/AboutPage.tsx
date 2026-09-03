import { useState } from "react";
import { Navbar } from "@/components/home/Navbar";
import { Footer } from "@/components/home/Footer";
import { Button } from "@/components/ui/button";
import { ExternalLink, RefreshCw, Loader2, Sparkles } from "lucide-react";

export default function AboutPage() {
  const [isLoading, setIsLoading] = useState(true);
  const portfolioUrl = "https://piyushsangam.vercel.app/";

  return (
    <div className="min-h-screen flex flex-col justify-between bg-background">
      <Navbar />

      {/* Top Embedded Header Strip */}
      <div className="border-b bg-card/60 backdrop-blur-md px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2 text-xs sm:text-sm font-medium">
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
            <Sparkles className="h-3 w-3" /> Portfolio Embed
          </span>
          <span className="text-muted-foreground hidden sm:inline">
            Piyush Sangam &bull; Full-Stack Developer
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
            onClick={() => {
              setIsLoading(true);
              const iframe = document.getElementById("portfolio-iframe") as HTMLIFrameElement;
              if (iframe) iframe.src = portfolioUrl;
            }}
          >
            <RefreshCw className="h-3 w-3" /> Reload
          </Button>

          <Button asChild size="sm" className="h-8 gap-1.5 text-xs bg-primary text-primary-foreground shadow-sm">
            <a href={portfolioUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-3 w-3" /> Open in New Tab
            </a>
          </Button>
        </div>
      </div>

      {/* Main Full-Height iFrame Container */}
      <main className="flex-1 w-full relative min-h-[calc(100vh-8.5rem)] flex flex-col bg-background">
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background/80 backdrop-blur-sm z-10 pointer-events-none">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-xs sm:text-sm text-muted-foreground font-medium">
              Loading Piyush Sangam's Portfolio...
            </p>
          </div>
        )}

        <iframe
          id="portfolio-iframe"
          src={portfolioUrl}
          title="Piyush Sangam Portfolio"
          className="w-full flex-1 border-0 min-h-[calc(100vh-8.5rem)] bg-background"
          onLoad={() => setIsLoading(false)}
          allow="fullscreen; clipboard-read; clipboard-write"
          loading="eager"
        />
      </main>

      <Footer />
    </div>
  );
}
