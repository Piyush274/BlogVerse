import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PlusCircle, FileText, MessageSquare, Clock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import RecentArticles from "./RecentArticles";
import { fetchDashboardStats, fetchMyArticles, DashboardStats } from "@/api/dashboard.api";
import { Article } from "@/api/articles.api";
import { useAuth } from "@/context/AuthContext";

export function BlogDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [statsData, articlesData] = await Promise.all([
        fetchDashboardStats(),
        fetchMyArticles(),
      ]);
      setStats(statsData);
      setArticles(articlesData);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  return (
    <main className="flex-1 p-4 md:p-8 space-y-8 max-w-7xl mx-auto w-full">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {user?.name || "Creator"}!
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your articles, review reader engagement, and craft new content.
          </p>
        </div>
        <Link to="/dashboard/articles/create">
          <Button className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-primary-foreground gap-2 shadow-md">
            <PlusCircle className="h-4 w-4" /> New Article
          </Button>
        </Link>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-card/60 backdrop-blur-md border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
            <FileText className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{stats?.totalArticles ?? 0}</div>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              Published articles in BlogVerse
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/60 backdrop-blur-md border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Comments</CardTitle>
            <MessageSquare className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{stats?.totalComments ?? 0}</div>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              Community feedback and discussions
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/60 backdrop-blur-md border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Reading Time</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">
                {stats?.avgReadingTime ? `${stats.avgReadingTime} min` : "0 min"}
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              Estimated reader duration per post
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Articles Management Table */}
      <RecentArticles
        articles={articles}
        onArticleDeleted={loadDashboardData}
      />
    </main>
  );
}
