import { apiClient } from "./client";

export interface LikeResponse {
  count: number;
  isLiked: boolean;
}

export async function fetchLikes(articleId: string): Promise<LikeResponse> {
  const response = await apiClient.get<LikeResponse>(`/articles/${articleId}/likes`);
  return response.data;
}

export async function toggleLike(articleId: string): Promise<LikeResponse> {
  const response = await apiClient.post<LikeResponse>(`/articles/${articleId}/likes/toggle`);
  return response.data;
}
