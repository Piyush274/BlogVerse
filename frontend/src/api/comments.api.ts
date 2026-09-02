import { apiClient } from "./client";
import { Author } from "./articles.api";

export interface CommentItem {
  id: string;
  _id?: string;
  body: string;
  article: string;
  author: Author;
  createdAt: string;
}

export async function fetchComments(articleId: string): Promise<CommentItem[]> {
  const response = await apiClient.get<CommentItem[]>(`/articles/${articleId}/comments`);
  return response.data;
}

export async function createComment(articleId: string, body: string): Promise<CommentItem> {
  const response = await apiClient.post<CommentItem>(`/articles/${articleId}/comments`, { body });
  return response.data;
}

export async function deleteComment(commentId: string): Promise<{ message: string }> {
  const response = await apiClient.delete<{ message: string }>(`/comments/${commentId}`);
  return response.data;
}
