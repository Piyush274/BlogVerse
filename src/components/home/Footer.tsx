import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";
import { FaXTwitter, FaGithub, FaLinkedin } from "react-icons/fa6";



export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:grid-cols-5">
          {/* Branding Section */}
          <div className="md:col-span-2 lg:col-span-2">
            <h2 className="text-2xl font-bold">
              <span className="bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
                Blog
              </span>
              <span className="text-foreground">Verse</span>
            </h2>
            <p className="mt-4 text-muted-foreground">
              Where ideas meet innovation. Dive into a world of insightful 
              articles written by passionate thinkers and industry experts.
            </p>
            
            <div className="mt-6 flex gap-2">
              <Button variant="ghost" size="icon">
                <FaXTwitter className="h-5 w-5 text-muted-foreground" />
              </Button>
              <Button variant="ghost" size="icon">
                <FaGithub className="h-5 w-5 text-muted-foreground" />
              </Button>
              <Button variant="ghost" size="icon">
                <FaLinkedin className="h-5 w-5 text-muted-foreground" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Explore</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">All Articles</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Topics</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Authors</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Podcasts</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Legal</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Cookie Policy</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Licenses</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4 md:col-span-2 lg:col-span-2">
            <h3 className="text-lg font-semibold text-foreground">Stay Updated</h3>
            <form className="flex flex-col gap-4">
              <div className="relative">
                <Input 
                  type="email" 
                  placeholder="Enter your email"
                  className="pl-10 pr-4 py-6"
                />
                <Mail className="h-5 w-5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
              <Button 
                type="submit" 
                className="w-full"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 border-t pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} BlogVerse. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}