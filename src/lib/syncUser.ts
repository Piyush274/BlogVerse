import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function syncUser() {
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  let dbUser = await prisma.user.findUnique({
    where: { clerkUserId: clerkUser.id },
  });

  if (!dbUser) {
    dbUser = await prisma.user.create({
      data: {
        clerkUserId: clerkUser.id,
        email: clerkUser.emailAddresses[0]?.emailAddress || "",
        name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || "Anonymous",
        imageUrl: clerkUser.imageUrl,
        role: "AUTHOR",
      },
    });
  }

  return dbUser;
}
