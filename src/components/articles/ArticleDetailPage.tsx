import { Card } from "@/components/ui/card"; 
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MessageCircle } from "lucide-react";
import { Prisma } from "@/generated/prisma";
import CommentForm from "./CommentForm";
import CommentList from "./CommentList";
import { prisma } from "@/lib/prisma"; 
import LikeUnlikeButton from "./LikeUnlikeButton";
import { auth } from "@clerk/nextjs/server";

type ArticleDetailPageProps = {
  article: Prisma.ArticlesGetPayload<{
    include: {
      author: {
        select: {
          name: true;
          email: true;
          imageUrl: true;
        };
      };
    };
  }>;
};

export async function ArticleDetailPage({ article }: ArticleDetailPageProps) {
  const comments = await prisma.comment.findMany({
    where: {
      articleId: article.id,
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
 
  const likes = await prisma.like.findMany({where:{articleId:article.id}});
  const {userId} = await auth();
  const user = await prisma.user.findUnique({where:{clerkUserId:userId as string}});

  const isLiked = likes.some((like) => like.userId === user?.id);
  
  

  return (
    <div className="min-h-screen bg-background">
      {/* Reuse your existing Navbar */}

      <main className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <article className="mx-auto max-w-3xl">
          {/* Article Header */}
          <header className="mb-12">
            <div className="flex flex-wrap gap-2 mb-4">
              <p className="mt-2 inline-block rounded-full bg-gradient-to-r from-primary to-purple-600 px-3 py-1 text-sm font-sm text-black">
              {article.category}
              </p>
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">
              {article.title}
            </h1>

            <div className="flex items-center gap-4 text-muted-foreground">
              <Avatar className="h-10 w-10">
                <AvatarImage src={article.author.imageUrl as string} />
                <AvatarFallback>{article.id}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-foreground">
                  {article.author.name}
                </p>
                <p className="text-sm">
                  {article.createdAt.toDateString()} 
                </p>
              </div>
            </div>
          </header>

          {/* Article Content */}
          <section
            className="prose prose-lg dark:prose-invert max-w-none mb-12"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Article Actions */}
          <LikeUnlikeButton  articleId={article.id} likes={likes} isLiked = {isLiked}/>

          {/* Comments Section */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-8">
              <MessageCircle className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold text-foreground">
                {comments.length} Comments
              </h2>
            </div>

            {/* Comment Form */}
            <CommentForm articleId={article.id} />

            {/* Comments List */}
            <CommentList comments={comments} />
          </Card>
        </article>
      </main>
    </div>
  );
}
