"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Menu, X } from "lucide-react";
import ModeToggle from "./ToggleMode";
import Link from "next/link";
import { SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import { SignedIn, UserButton } from "@clerk/nextjs";
import SearchInput from "./SearchInput";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          <div className="flex items-center gap-8">
            {/* Todo: Add Logo here*/}
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold">
                <span className="bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
                  Blog
                </span>
                <span className="text-foreground">Verse</span>
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-4">
              <Link
                href="/articles"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Articles
              </Link>
              <Link
                href="/tutorials"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Tutorials
              </Link>
              <Link
                href="/about"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                About
              </Link>
              <Link
                href="/dashboard"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Dashboard
              </Link>
            </div>
          </div>

          
          <div className="flex items-center gap-4">
            
            <SearchInput/>

           
            <ModeToggle />

           
            <SignedIn>              
              <UserButton/>
            </SignedIn>
            <SignedOut>
              <div className="hidden md:flex items-center gap-2">
                <SignInButton>
                  <Button variant="outline">Login</Button>
                </SignInButton>
                <SignUpButton>
                  <Button>Sign up</Button>
                </SignUpButton>
              </div>
            </SignedOut>

            {/*For Mobile screens */}
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
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4 border-t">
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

            {/*For Mobile Screen UI*/}

            <div className="space-y-2 px-4">
              <Link
                href="/articles"
                className="block px-3 py-2 text-base font-medium text-foreground"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Articles
              </Link>
              <Link
                href="/tutorials"
                className="block px-3 py-2 text-base font-medium text-foreground"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Tutorials
              </Link>
              <Link
                href="/about"
                className="block px-3 py-2 text-base font-medium text-foreground"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/dashboard"
                className="block px-3 py-2 text-base font-medium text-foreground"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
            </div>

            {/* Mobile Auth Buttons */}

            <SignedOut>
              <div className="px-4 flex flex-col gap-2">
                <SignInButton>
                  <Button variant="outline" className="w-full">
                    Login
                  </Button>
                </SignInButton>
                <SignUpButton>
                  <Button className="w-full">Sign up</Button>
                </SignUpButton>
              </div>
            </SignedOut>
          </div>
        )}
      </div>
    </nav>
  );
}