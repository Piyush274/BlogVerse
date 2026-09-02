import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, PenTool, Github, Linkedin, Heart } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-background/50 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Column 1: Brand */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <PenTool className="h-5 w-5 text-primary" />
            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              BlogVerse
            </span>
          </h2>
          <p className="text-sm text-muted-foreground">
            A digital canvas for curious minds. Explore, learn, and grow with our community.
          </p>
          <p className="text-xs text-muted-foreground flex items-center">
            Made by Piyush Sangam <Heart className="h-3 w-3 ml-1 text-red-500 fill-red-500" />
          </p>
          
          <div className="flex gap-4">
            <Button asChild variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <Link href="https://github.com/Piyush274" target="_blank" rel="noopener noreferrer">
                <Github className="h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <Link href="https://www.linkedin.com/in/piyush-sangam-45b42034b/" target="_blank" rel="noopener noreferrer">
                <Linkedin className="h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <Link href="mailto:piyushsangam222@gmail.com" target="_blank" rel="noopener noreferrer">
                <Mail className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Column 2: Explore */}
        <div>
          <h3 className="text-md font-semibold text-foreground mb-4">Explore</h3>
          <ul className="space-y-3">
            <li>
              <Link href="/articles" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                All Articles
              </Link>
            </li>
            <li>
              <Link href="/dashboard" prefetch={false} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Dashboard
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                About
              </Link>
            </li>
            <li>
              <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Podcasts
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Legal */}
        <div>
          <h3 className="text-md font-semibold text-foreground mb-4">Legal</h3>
          <ul className="space-y-3">
            <li>
              <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Cookie Policy
              </Link>
            </li>
            <li>
              <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Licenses
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 4: Newsletter */}
        <div className="space-y-4">
          <h3 className="text-md font-semibold text-foreground">Stay Updated</h3>
          <p className="text-sm text-muted-foreground">
            Subscribe to our newsletter for the latest articles and updates.
          </p>
          <form className="flex gap-2">
            <div className="relative flex-1">
              <Input 
                type="email" 
                placeholder="Your email" 
                className="bg-background pl-10"
              />
              <Mail className="h-4 w-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
            <Button 
              type="submit" 
              variant="default" 
              size="sm"
              className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
            >
              Subscribe
            </Button>
          </form>
        </div>
      </div>

      <div className="border-t py-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} BlogVerse. All rights reserved.
          </p>
          
          <div className="flex gap-6">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Terms
            </Link>
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}