import { FileText, MessageCircle, PlusCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import RecentArticles from "@/components/dashboard/RecentArticles";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { currentUser } from '@clerk/nextjs/server';

export async function BlogDashboard() 
{

  const user = await currentUser();

// Fetch current user's articles and total comments
const [userWithArticles, totalComments] = await Promise.all([
  prisma.user.findUnique({
    where: { clerkUserId: user?.id },
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
          clerkUserId: user?.id,
        },
      },
    },
  }),
]);

// Access articles like:
const articles = userWithArticles?.articles ?? [];


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
            {articles.length>0 && "+2 from last month"}  
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
              {totalComments>0 && "3 awaiting moderation"}
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
            <div className="text-2xl font-bold"> {articles.length>0 ? "3.7m" : "0m"} </div>
            <p className="text-xs text-muted-foreground mt-1">
              {articles.length>0 && "+0.8m from last month"}
            </p>
          </CardContent>
        </Card>
      </div>

      <RecentArticles articles={articles} />
    </main>
  );
}