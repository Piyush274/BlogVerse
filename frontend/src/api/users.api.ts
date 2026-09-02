import { apiClient } from "./client";
import { Author } from "./articles.api";

export async function syncUser(clerkUserId?: string): Promise<Author> {
  const response = await apiClient.post<Author>("/users/sync", { clerkUserId });
  return response.data;
}

export async function getMe(): Promise<Author> {
  const response = await apiClient.get<Author>("/users/me");
  return response.data;
}
