import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BlogVerse",
  description: "Where ideas come to life — discover, write, and share on BlogVerse",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

    <ClerkProvider>
    <html lang="en" suppressHydrationWarning>

      
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} >

        <ThemeProvider
         attribute="class"
         defaultTheme="system"
         enableSystem
         disableTransitionOnChange>
         <Toaster />
        {children}

        </ThemeProvider>

      </body>

    </html>

    </ClerkProvider>

  );
}
