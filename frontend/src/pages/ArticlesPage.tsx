import { useEffect, useState } from "react";
import { AllArticlesPage } from "@/components/articles/AllArticlesPage";
import ArticleSearchInput from "@/components/articles/ArticleSearchInput";
import AllArticlesPageSkeleton from "@/components/articles/AllArticlesPageSkeleton";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/home/Navbar";
import { Footer } from "@/components/home/Footer";
import { useSearchParams, useNavigate } from "react-router-dom";
import { fetchArticles, Article } from "@/api/articles.api";

const ITEMS_PER_PAGE = 6;

const CATEGORIES = [
  "All",
  "AI",
  "Machine Learning",
  "Data Science",
  "Cloud Computing",
  "Cybersecurity",
  "UI/UX Design",
  "DevOps",
  "Blockchain",
  "Productivity",
  "Open Source",
];

export default function ArticlesPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const searchText = searchParams.get("search") || "";
  const selectedCategory = searchParams.get("category") || "All";
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const [articles, setArticles] = useState<Article[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchArticles({
      search: searchText,
      category: selectedCategory === "All" ? undefined : selectedCategory,
      page: currentPage,
      limit: ITEMS_PER_PAGE,
    })
      .then((data) => {
        setArticles(data.articles);
        setTotal(data.total);
        setTotalPages(data.totalPages || 1);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching articles:", err);
        setLoading(false);
      });
  }, [searchText, selectedCategory, currentPage]);

  const updateQueryParams = (newParams: { search?: string; category?: string; page?: number }) => {
    const params = new URLSearchParams(searchParams);

    if (newParams.search !== undefined) {
      if (newParams.search) params.set("search", newParams.search);
      else params.delete("search");
      params.set("page", "1");
    }

    if (newParams.category !== undefined) {
      if (newParams.category && newParams.category !== "All") params.set("category", newParams.category);
      else params.delete("category");
      params.set("page", "1");
    }

    if (newParams.page !== undefined) {
      params.set("page", newParams.page.toString());
    }

    navigate(`/articles?${params.toString()}`);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-background">
      <div>
        <Navbar />
        <main className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 max-w-7xl">
          {/* Page Header */}
          <div className="mb-10 space-y-6 text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
              All Articles
            </h1>
            <p className="text-muted-foreground text-base max-w-lg mx-auto">
              Explore insightful guides, deep dives, and discussions created by authors worldwide.
            </p>

            {/* Search Bar */}
            <ArticleSearchInput onSearchChange={(text) => updateQueryParams({ search: text })} />

            {/* Category Filter Chips */}
            <div className="flex flex-wrap justify-center gap-2 pt-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => updateQueryParams({ category: cat })}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                    selectedCategory === cat
                      ? "bg-primary text-primary-foreground shadow-sm scale-105"
                      : "bg-muted/70 text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Articles Grid */}
          {loading ? (
            <AllArticlesPageSkeleton />
          ) : (
            <AllArticlesPage articles={articles} />
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="mt-12 flex justify-center items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage <= 1}
                onClick={() => updateQueryParams({ page: currentPage - 1 })}
              >
                ← Prev
              </Button>

              {Array.from({ length: totalPages }).map((_, index) => {
                const pageNum = index + 1;
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateQueryParams({ page: pageNum })}
                    className="w-9"
                  >
                    {pageNum}
                  </Button>
                );
              })}

              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages}
                onClick={() => updateQueryParams({ page: currentPage + 1 })}
              >
                Next →
              </Button>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
}
