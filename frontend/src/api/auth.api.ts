import { apiClient } from "./client";
import { Author } from "./articles.api";

export interface AuthResponse {
  token: string;
  user: Author;
}

export interface RegisterData {
  name: string;
  email: string;
  password?: string;
}

export interface LoginData {
  email: string;
  password?: string;
}

export async function registerUser(data: RegisterData): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>("/auth/register", data);
  return response.data;
}

export async function loginUser(data: LoginData): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>("/auth/login", data);
  return response.data;
}

export async function getMeUser(): Promise<Author> {
  const response = await apiClient.get<Author>("/auth/me");
  return response.data;
}
