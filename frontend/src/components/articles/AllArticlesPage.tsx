import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Article } from "@/api/articles.api";

type SearchPageProps = {
  articles: Article[];
};

export function AllArticlesPage({ articles }: SearchPageProps) {
  if (articles.length === 0) return <NoSearchResults />;

  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map((article) => {
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
                {/* Article Content */}
                <h3 className="text-xl font-semibold text-foreground line-clamp-2">
                  {article.title}
                </h3>

                {/* Author & Metadata */}
                <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={article.author?.imageUrl} alt={article.author?.name} />
                      <AvatarFallback>
                        {article.author?.name ? article.author.name.charAt(0) : "U"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-muted-foreground">
                      {article.author?.name || "Anonymous"}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(article.createdAt).toDateString()}
                  </div>
                </div>
              </Link>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

export function NoSearchResults() {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border rounded-2xl border-dashed bg-card/40 my-8">
      {/* Icon */}
      <div className="mb-4 rounded-full bg-muted p-4">
        <Search className="h-8 w-8 text-muted-foreground" />
      </div>

      {/* Title */}
      <h3 className="text-xl font-semibold text-foreground">
        No Results Found
      </h3>

      {/* Description */}
      <p className="mt-2 text-muted-foreground max-w-sm">
        We could not find any articles matching your search. Try a different
        keyword or explore all categories.
      </p>
    </div>
  );
}
