import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"; 
import { Search } from "lucide-react";
import Image from "next/image";
import { Prisma } from "@/generated/prisma";
import Link from "next/link";
import { cn } from "@/lib/utils";

type SearchPageProps = {
  articles: Prisma.ArticlesGetPayload<{
    include:{
      author:{
        select:{
          name:true,
          email:true,
          imageUrl:true
        }
      }
    }
  }>[];
};

export function AllArticlesPage({ articles }: SearchPageProps) {
 
  if (articles.length === 0) return <NoSearchResults />;

  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {articles?.map((article) => (
        <Card
          key={article.id}
                    className={cn(
                      "group relative overflow-hidden transition-all hover:scale-[1.02]",
                      "border border-gray-200/50 dark:border-white/10",
                      "bg-white/50 dark:bg-gray-900/50 backdrop-blur-lg"
                    )}
        >
          <div className="p-6">
             <Link href={`/articles/${article.id}`}>
                           <p className="mt-2 inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-sm text-primary">
              {article.category}
              </p>
            <div className="relative mb-4 h-48 w-full overflow-hidden rounded-xl">
              <Image
                src={article.featuredImage as string}
                alt={article.title}
                fill
                className="object-cover"
              />
            </div>
            {/* Article Content */}
            <h3 className="text-xl font-semibold text-foreground">
              {article.title}
            </h3>

            {/* Author & Metadata */}
            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={article.author.imageUrl as string} />
                  <AvatarFallback>{article.author.name}</AvatarFallback>
                </Avatar>
                <span className="text-sm text-muted-foreground">
                  {article.author.name}
                </span>
              </div>
              <div className="text-sm text-muted-foreground">
                {article.createdAt.toDateString()}
              </div>
            </div>
            </Link>
          </div>
        </Card>
      ))}
    </div>
  );
}

export function NoSearchResults() {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      {/* Icon */}
      <div className="mb-4 rounded-full bg-muted p-4">
        <Search className="h-8 w-8 text-muted-foreground" />
      </div>

      {/* Title */}
      <h3 className="text-xl font-semibold text-foreground">
        No Results Found
      </h3>

      {/* Description */}
      <p className="mt-2 text-muted-foreground">
        We could not find any articles matching your search. Try a different
        keyword or phrase.
      </p>
    </div>
  );
}
