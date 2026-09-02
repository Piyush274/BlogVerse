import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/home/Navbar";
import { Sidebar } from "@/components/dashboard/Sidebar";
import EditArticleContent from "@/components/articles/EditArticlePage";
import { fetchArticleById, Article } from "@/api/articles.api";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft } from "lucide-react";

export default function EditArticlePage() {
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
        console.error("Failed to load article for editing:", err);
        setError(err.message || "Failed to load article.");
        setLoading(false);
      });
  }, [id]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="flex-1 flex">
        <Sidebar />
        <main className="flex-1 p-4 md:p-8 max-w-4xl mx-auto w-full">
          <div className="mb-6">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-2"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Dashboard
            </Link>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Loading article...</p>
            </div>
          ) : error || !article ? (
            <div className="text-center py-12 space-y-4">
              <h2 className="text-xl font-bold text-foreground">Unable to edit article</h2>
              <p className="text-muted-foreground">{error || "Article not found."}</p>
              <Link to="/dashboard">
                <Button variant="outline">Back to Dashboard</Button>
              </Link>
            </div>
          ) : (
            <EditArticleContent article={article} />
          )}
        </main>
      </div>
    </div>
  );
}
