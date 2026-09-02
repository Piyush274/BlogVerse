import { apiClient } from "./client";
import { Article } from "./articles.api";

export interface DashboardStats {
  totalArticles: number;
  totalComments: number;
  avgReadingTime: number;
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const response = await apiClient.get<DashboardStats>("/dashboard/stats");
  return response.data;
}

export async function fetchMyArticles(): Promise<Article[]> {
  const response = await apiClient.get<Article[]>("/dashboard/my-articles");
  return response.data;
}
