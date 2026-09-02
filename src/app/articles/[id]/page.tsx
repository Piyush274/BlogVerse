import { ArticleDetailPage } from "@/components/articles/ArticleDetailPage";
import { prisma } from "@/lib/prisma";
import React from "react";

export const dynamic = 'force-dynamic';

type ArticleDetailPageProps = {
  params: Promise<{ id: string }>;
};

const page: React.FC<ArticleDetailPageProps> = async ({ params }) => {
  const id = (await params).id;
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
    return <h1>Article not found.</h1>;
  }
  return (
    <div>
      <ArticleDetailPage article={article} /> 
    </div>
  );
};

export default page;
