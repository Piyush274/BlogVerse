import { apiClient } from "./client";

export interface Author {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  imageUrl?: string;
  role?: string;
}

export interface Article {
  id: string;
  _id?: string;
  title: string;
  content: string;
  category: string;
  featuredImage: string;
  author: Author;
  createdAt: string;
  updatedAt: string;
  comments?: any[];
  likes?: any[];
}

export interface PaginatedArticles {
  articles: Article[];
  total: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

export async function fetchArticles(params?: {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
}): Promise<PaginatedArticles> {
  const response = await apiClient.get<PaginatedArticles>("/articles", { params });
  return response.data;
}

export async function fetchTopArticles(): Promise<Article[]> {
  const response = await apiClient.get<Article[]>("/articles/top");
  return response.data;
}

export async function fetchArticleById(id: string): Promise<Article> {
  const response = await apiClient.get<Article>(`/articles/${id}`);
  return response.data;
}

export async function createArticle(formData: FormData): Promise<Article> {
  const response = await apiClient.post<Article>("/articles", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}

export async function updateArticle(id: string, formData: FormData): Promise<Article> {
  const response = await apiClient.put<Article>(`/articles/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}

export async function deleteArticle(id: string): Promise<{ message: string }> {
  const response = await apiClient.delete<{ message: string }>(`/articles/${id}`);
  return response.data;
}
