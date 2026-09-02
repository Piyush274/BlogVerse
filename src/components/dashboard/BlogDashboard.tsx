import { FileText, MessageCircle, PlusCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import RecentArticles from "@/components/dashboard/RecentArticles";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { syncUser } from "@/lib/syncUser";

export async function BlogDashboard() 
{
  const user = await syncUser();

  if (!user) {
    return (
      <main className="flex-1 p-4 md:p-8 flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
        <h2 className="text-2xl font-bold">Authentication Required</h2>
        <p className="text-muted-foreground max-w-md">
          Please sign in to view and manage your articles, comments, and dashboard analytics.
        </p>
        <Link href="/sign-in">
          <Button>Sign In to Continue</Button>
        </Link>
      </main>
    );
  }

  // Fetch current user's articles and total comments
  const [userWithArticles, totalComments] = await Promise.all([
    prisma.user.findUnique({
      where: { clerkUserId: user.clerkUserId },
      include: {
        articles: {
          orderBy: { createdAt: 'desc' },
          include: { 
            comments: true, 
            likes: true,
            author: {
              select: {
                name: true,
                email: true,
                imageUrl: true,
              },
            },
          },
        },
      },
    }),
    prisma.comment.count({
      where: {
        article: {
          author: {
            clerkUserId: user?.clerkUserId,
          },
        },
      },
    }),
  ]);

  // Access articles like:
  const articles = userWithArticles?.articles ?? [];

  // Calculate average reading time dynamically
  const totalWords = articles.reduce((acc, art) => {
    const plainText = art.content.replace(/<[^>]*>/g, "");
    return acc + plainText.split(/\s+/).filter(Boolean).length;
  }, 0);
  // Average reading speed: 200 words per minute
  const avgReadingTime = articles.length > 0 ? Math.ceil(totalWords / (200 * articles.length)) : 0;

  return (
    <main className="flex-1 p-4 md:p-8">
        
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Blog Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your content and analytics
          </p>
        </div>
        <Link href={"/dashboard/articles/create"}>
          <Button className="gap-2">
            <PlusCircle className="h-4 w-4" />
            New Article
          </Button>
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Articles
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{articles.length}</div> 
            <p className="text-xs text-muted-foreground mt-1">
              Articles created in your library
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Comments
            </CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalComments}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total feedback across all articles
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg. Reading Time
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold"> {avgReadingTime}m </div>
            <p className="text-xs text-muted-foreground mt-1">
              Estimated reading duration per article
            </p>
          </CardContent>
        </Card>
      </div>

      <RecentArticles articles={articles} />
    </main>
  );
}