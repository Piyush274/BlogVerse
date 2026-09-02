import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/home/Navbar";
import { Footer } from "@/components/home/Footer";
import { ArticleDetailPage as ArticleDetailContent } from "@/components/articles/ArticleDetailPage";
import { Button } from "@/components/ui/button";
import { fetchArticleById, Article } from "@/api/articles.api";
import { Loader2, ArrowLeft } from "lucide-react";

export default function ArticleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchArticleById(id)
      .then((data) => {
        setArticle(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading article detail:", err);
        setError(err.message || "Article not found.");
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-between">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading article...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen flex flex-col justify-between">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-4 min-h-[60vh]">
          <h1 className="text-2xl font-bold text-foreground">Article not found</h1>
          <p className="text-muted-foreground max-w-md">
            {error || "The article you are looking for does not exist or has been removed."}
          </p>
          <Link to="/articles">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Back to Articles
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Navbar />
      <ArticleDetailContent article={article} />
      <Footer />
    </div>
  );
}
