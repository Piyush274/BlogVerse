import {
  AllArticlesPage,
} from "@/components/articles/AllArticlesPage";
import ArticleSearchInput from "@/components/articles/ArticleSearchInput";
import { Button } from "@/components/ui/button";
import React, { Suspense } from "react";
import AllArticlesPageSkeleton from "@/components/articles/AllArticlesPageSkeleton";
import { fetchArticleByQuery } from "@/lib/query/fetchArticleByQuery";
import Link from "next/link";

type SearchPageProps = {
  searchParams: Promise<{ search?: string; page?: string }>;
};

const ITEMS_PER_PAGE = 3;

const page: React.FC<SearchPageProps> = async ({ searchParams }) => {
  const resolvedParams = await searchParams;
  const searchText = resolvedParams.search || "";
  const currentPage = Number(resolvedParams.page) || 1;
  const skip = (currentPage - 1) * ITEMS_PER_PAGE;
  const take = ITEMS_PER_PAGE;

  const { articles, total } = await fetchArticleByQuery(searchText, skip, take);
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-12 space-y-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            All Articles
          </h1>
          {/* Search Bar */}
          <Suspense fallback={<h1>Loading...</h1>}>
            <ArticleSearchInput />
          </Suspense>
        </div>

        {/* All Articles Grid */}
        <Suspense fallback={<AllArticlesPageSkeleton />}>
          <AllArticlesPage articles={articles} />
        </Suspense>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center gap-2">
            {/* Prev Button */}
            <Link
              href={`?search=${encodeURIComponent(searchText)}&page=${currentPage - 1}`}
              passHref
            >
              <Button variant="ghost" size="sm" disabled={currentPage === 1}>
                ← Prev
              </Button>
            </Link>

            {/* Page Numbers */}
            {Array.from({ length: totalPages }).map((_, index) => (
              <Link
                key={index}
                href={`?search=${encodeURIComponent(searchText)}&page=${index + 1}`}
                passHref
              >
                <Button
                  variant={currentPage === index + 1 ? "destructive" : "ghost"}
                  size="sm"
                  disabled={currentPage === index + 1}
                >
                  {index + 1}
                </Button>
              </Link>
            ))}

            {/* Next Button */}
            <Link
              href={`?search=${encodeURIComponent(searchText)}&page=${currentPage + 1}`}
              passHref
            >
              <Button
                variant="ghost"
                size="sm"
                disabled={currentPage === totalPages}
              >
                Next →
              </Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
};

export default page;
