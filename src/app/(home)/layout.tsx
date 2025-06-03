import React from 'react';
import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

interface LayoutProps {
  children: React.ReactNode;
}

export default async function Layout({ children }: LayoutProps) {
  
  const user = await currentUser();

  // Only sync user if they're logged in
  if (user) {
    try {
      const loggedInUser = await prisma.user.findUnique({
        where: { clerkUserId: user?.id },
      });

      if (!loggedInUser) {
        await prisma.user.create({
          data: {
            name: user.fullName || 'Anonymous',
            email: user.emailAddresses[0]?.emailAddress || '',
            clerkUserId: user.id,
            imageUrl: user.imageUrl || "",
          },
        });
      }
    } catch (error) {
      console.error('Error syncing user data:', error);
      // Continue rendering even if sync fails
    }
  }

  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
}