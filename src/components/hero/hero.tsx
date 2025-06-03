"use client";
import { Button } from "@/components/ui/button";
import { Sparkles, PenTool, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { TypewriterEffect } from "@/components/ui/typewriter-effect"
import { UserPen } from 'lucide-react';

export default function Hero() {
  const words = [
    { text: "Write" },
    { text: "your" },
    { text: "story", className: "text-primary" },
    { text: "with" },
    { text: "BlogVerse.", className: "text-purple-600" },
  ];

  return (
    <section className="relative overflow-hidden">

      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary opacity-20 blur-[100px]"></div>
      </div>

      <div className="mx-auto max-w-7xl px-6 pt-24 pb-16 sm:pt-32 lg:flex lg:px-8 lg:py-40">
        <div className="mx-auto max-w-2xl flex-shrink-0 lg:mx-0 lg:max-w-xl lg:pt-8">
          <div className="flex items-center gap-x-2 rounded-full bg-accent px-4 py-2 text-xs font-medium w-fit mb-6">
            <Sparkles className="h-4 w-4 text-primary" />
            <span>Introducing BlogVerse</span>
          </div>

          <TypewriterEffect words={words} className="text-left mb-6" />

          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            A modern platform for writers and readers. Share your thoughts, discover new perspectives,
            and join a community of passionate creators.
          </p>

          <div className="mt-10 flex items-center gap-x-6">


              <Link href="/dashboard/articles/create">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 group"
                >
                  Get started
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>

              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 group"
                >
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>

          </div>

          <div className="mt-10 flex items-center gap-x-4">
            <div className="flex -space-x-2">
              {/* Sample user avatars */}
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-10 w-10 rounded-full bg-gradient-to-r from-primary/20 to-purple-600/20 border-2 border-background flex items-center justify-center text-xs font-medium"
                >
                 <UserPen />
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              Join <span className="font-medium text-primary">10,000+</span> creators
            </p>
          </div>
        </div>

        <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative rounded-2xl bg-gradient-to-br from-primary/10 to-purple-600/10 p-2 ring-1 ring-primary/10 lg:w-[600px] lg:h-[400px]"
          >
            <div className="absolute -top-16 -left-16 w-32 h-32 rounded-full bg-purple-600/20 blur-3xl"></div>
            <div className="absolute -bottom-16 -right-16 w-32 h-32 rounded-full bg-primary/20 blur-3xl"></div>
            
            {/* Mock blog post preview */}
            <div className="bg-background/80 backdrop-blur rounded-xl h-full p-6 flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <PenTool className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm font-medium">Featured Post</span>
              </div>
              <h3 className="text-xl font-bold mb-2">How Blockchain is Reshaping the Digital World</h3>
              <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
               Explore how blockchain technology is revolutionizing transparency, security, and decentralization across industries. Discover why businesses, developers, and everyday users are embracing this trustless system to build a reliable digital future.
              </p>
              <div className="mt-auto flex justify-between items-center">
                <span className="text-xs text-muted-foreground">5 min read</span>
                <Link href="/articles">
                <Button variant="ghost" size="sm" className="text-primary">
                  Read more
                </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}