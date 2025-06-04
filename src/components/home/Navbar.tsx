"use client";
import { useState, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Menu, X, PenTool, Sparkles } from "lucide-react";
import ModeToggle from "./ToggleMode";
import Link from "next/link";
import { SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import { SignedIn, UserButton } from "@clerk/nextjs";
import SearchInput from "./SearchInput";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="flex items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 h-16">
        {/* Left side - Logo and Navigation */}
        <div className="flex items-center gap-6">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-xl font-semibold tracking-tight hover:opacity-80 transition-opacity"
          >
            <PenTool className="h-5 w-5 text-primary" />
            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              BlogVerse
            </span>
            <span className="hidden sm:inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80 ml-2">
              <Sparkles className="h-3 w-3 mr-1" />
              New
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            <Link href="/articles">
              <Button variant="ghost" className="text-sm font-medium">
                Articles
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="ghost" className="text-sm font-medium">
                About
              </Button>
            </Link>
          </div>
        </div>

        {/* Right side - User controls */}
        <div className="flex items-center gap-2">
          <div className="hidden md:block">
                      <Suspense fallback={<h1>Loading...</h1>}>
                        <SearchInput />
                      </Suspense>
            
          </div>
          
          <Link href="/dashboard">
            <Button 
              variant="ghost" 
              size="sm" 
              className="hidden sm:flex text-sm font-medium hover:bg-accent/90"
            >
              Dashboard
            </Button>
          </Link>

          <ModeToggle />
          
          <SignedIn>              
            <div className="ml-2">
              <UserButton />
            </div>
          </SignedIn>
          
          <SignedOut>
            <div className="hidden md:flex items-center gap-2">
              <SignInButton>
                <Button variant="outline" size="sm" className="text-sm font-medium">
                  Login
                </Button>
              </SignInButton>
              <SignUpButton>
                <Button size="sm" className="text-sm font-medium bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90">
                  Sign Up
                </Button>
              </SignUpButton>
            </div>
          </SignedOut>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-muted-foreground hover:text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-16 left-0 right-0 md:hidden py-4 space-y-4 border-t bg-background">
            {/* Search Bar (Mobile) */}
            <div className="px-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search articles..."
                  className="pl-10 w-full focus-visible:ring-1"
                />
              </div>
            </div>

            {/* Mobile Navigation */}
            <div className="space-y-1 px-4">
              <Link
                href="/articles"
                className="block px-3 py-2 text-base font-medium rounded-md hover:bg-accent"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Articles
              </Link>
              <Link
                href="/about"
                className="block px-3 py-2 text-base font-medium rounded-md hover:bg-accent"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/dashboard"
                className="block px-3 py-2 text-base font-medium rounded-md hover:bg-accent"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
            </div>

            {/* Mobile Auth Buttons */}
            <SignedOut>
              <div className="px-4 flex flex-col gap-2 pt-2">
                <SignInButton>
                  <Button variant="outline" className="w-full">
                    Login
                  </Button>
                </SignInButton>
                <SignUpButton>
                  <Button className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90">
                    Sign Up
                  </Button>
                </SignUpButton>
              </div>
            </SignedOut>
          </div>
        )}
      </nav>
    </header>
  );
}