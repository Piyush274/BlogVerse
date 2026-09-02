import { ArticleDetailPage } from "@/components/articles/ArticleDetailPage";
import { prisma } from "@/lib/prisma";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const dynamic = 'force-dynamic';

type ArticleDetailPageProps = {
  params: Promise<{ id: string }>;
};

const page: React.FC<ArticleDetailPageProps> = async ({ params }) => {
  const { id } = await params;

  if (!id) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
        <h1 className="text-2xl font-bold text-foreground">Article not found</h1>
        <Link href="/articles">
          <Button variant="outline">Back to Articles</Button>
        </Link>
      </div>
    );
  }

  try {
    const article = await prisma.articles.findUnique({
      where: {
        id,
      },
      include: {
        author: {
          select: {
            name: true,
            email: true,
            imageUrl: true,
          },
        },
      },
    });

    if (!article) {
      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
          <h1 className="text-2xl font-bold text-foreground">Article not found</h1>
          <p className="text-muted-foreground">The article you are looking for does not exist or has been removed.</p>
          <Link href="/articles">
            <Button variant="outline">Back to Articles</Button>
          </Link>
        </div>
      );
    }

    return <ArticleDetailPage article={article} />;
  } catch (error) {
    console.error("Error loading article:", error);
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
        <h1 className="text-2xl font-bold text-foreground">Unable to load article</h1>
        <p className="text-muted-foreground">An error occurred while loading this article.</p>
        <Link href="/articles">
          <Button variant="outline">Back to Articles</Button>
        </Link>
      </div>
    );
  }
};

export default page;
