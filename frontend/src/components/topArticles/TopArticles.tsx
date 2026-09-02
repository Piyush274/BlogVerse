import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { fetchTopArticles, Article } from "@/api/articles.api";

export function TopArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopArticles()
      .then((data) => {
        setArticles(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load top articles:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-6 rounded-xl border bg-card/50 space-y-4">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-48 w-full rounded-xl" />
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-6 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No articles published yet. Be the first creator to publish!
      </div>
    );
  }

  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
      {articles.slice(0, 4).map((article) => {
        const articleId = article.id || (article as any)._id;
        return (
          <Card
            key={articleId}
            className={cn(
              "group relative overflow-hidden transition-all hover:scale-[1.02]",
              "border border-gray-200/50 dark:border-white/10",
              "bg-white/50 dark:bg-gray-900/50 backdrop-blur-lg"
            )}
          >
            <div className="p-6">
              <Link to={`/articles/${articleId}`}>
                <p className="mt-2 inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                  {article.category}
                </p>
                <div className="relative mb-4 mt-3 h-48 w-full overflow-hidden rounded-xl bg-muted">
                  <img
                    src={article.featuredImage}
                    alt={article.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={article.author?.imageUrl} alt={article.author?.name} />
                    <AvatarFallback>
                      {article.author?.name ? article.author.name.charAt(0) : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span>{article.author?.name || "Anonymous"}</span>
                </div>

                <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white line-clamp-2">
                  {article.title}
                </h3>

                <div className="mt-6 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span>{new Date(article.createdAt).toDateString()}</span>
                </div>
              </Link>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
