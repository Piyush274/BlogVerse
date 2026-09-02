import { apiClient } from "./client";

export async function createCheckoutSession(priceId: string): Promise<{ id: string; url?: string }> {
  const response = await apiClient.post<{ id: string; url?: string }>(
    "/payments/create-checkout-session",
    { priceId }
  );
  return response.data;
}
