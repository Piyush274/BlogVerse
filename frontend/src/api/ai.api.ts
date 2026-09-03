import { apiClient } from "./client";

export interface AgentStepLog {
  step: "research" | "drafting" | "critique" | "seo";
  status: "started" | "in-progress" | "completed";
  summary: string;
  timestamp: string;
  data?: any;
}

export interface EditorialResult {
  title: string;
  content: string;
  category: string;
  tags: string[];
  metaDescription: string;
  suggestedCoverPrompt: string;
  critiqueScore: number;
  critiqueNotes: string[];
  logs: AgentStepLog[];
}

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface Citation {
  chunkIndex: number;
  text: string;
  score: number;
}

export interface ChatResponse {
  success: boolean;
  answer: string;
  citations: Citation[];
}

export interface ArticleSummaryResponse {
  success: boolean;
  summary: string;
  keyTakeaways: string[];
}

export interface DebatePerspective {
  title: string;
  viewpoint: string;
  percentage: number;
}

export interface DebateSummaryResponse {
  success: boolean;
  hasEnoughData: boolean;
  totalComments: number;
  consensus: string;
  perspectives: DebatePerspective[];
  overallSentiment: "Constructive" | "Vibrant Debate" | "General Praise" | "Inquisitive";
  keyTakeaway: string;
  discussionStarter?: string;
}

/**
 * Stream the Multi-Agent Editorial Pipeline using Server-Sent Events (SSE).
 */
export async function streamEditorialPipeline(
  payload: {
    topic: string;
    category?: string;
    tone?: string;
    targetLength?: string;
  },
  onStep: (stepLog: AgentStepLog) => void,
  onComplete: (result: EditorialResult) => void,
  onError: (error: string) => void
): Promise<() => void> {
  const token = localStorage.getItem("blogverse_token");
  const controller = new AbortController();
  const API_BASE = import.meta.env.VITE_API_URL || "/api";

  try {
    const response = await fetch(`${API_BASE}/ai/generate-article-stream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      throw new Error(errJson.error || `HTTP error ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error("No response body reader available.");

    const decoder = new TextDecoder();
    let buffer = "";

    const readStream = async () => {
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n\n");
          buffer = lines.pop() || "";

          for (const block of lines) {
            const eventMatch = block.match(/event:\s*([^\n]+)/);
            const dataMatch = block.match(/data:\s*([^\n]+)/);

            if (eventMatch && dataMatch) {
              const eventType = eventMatch[1].trim();
              const eventData = JSON.parse(dataMatch[1]);

              if (eventType === "step") {
                onStep(eventData as AgentStepLog);
              } else if (eventType === "complete") {
                onComplete(eventData as EditorialResult);
              }
            }
          }
        }
      } catch (err: any) {
        if (err.name !== "AbortError") {
          onError(err.message || "Streaming failed");
        }
      }
    };

    readStream();
  } catch (err: any) {
    onError(err.message || "Failed to initiate AI stream");
  }

  // Return cancel function
  return () => controller.abort();
}

/**
 * Direct non-streaming agent generation
 */
export async function generateEditorialDirect(payload: {
  topic: string;
  category?: string;
  tone?: string;
}): Promise<EditorialResult> {
  const { data } = await apiClient.post("/ai/generate-article", payload);
  return data.data;
}

/**
 * Conversational RAG with an article
 */
export async function askArticleAssistant(
  articleId: string,
  question: string,
  history: ChatMessage[] = []
): Promise<ChatResponse> {
  const { data } = await apiClient.post(`/ai/articles/${articleId}/chat`, {
    question,
    history,
  });
  return data;
}

/**
 * Fetch instant AI executive summary
 */
export async function getArticleSummary(articleId: string): Promise<ArticleSummaryResponse> {
  const { data } = await apiClient.get(`/ai/articles/${articleId}/summary`);
  return data;
}

/**
 * Fetch community debate summary
 */
export async function getDebateSummary(articleId: string): Promise<DebateSummaryResponse> {
  const { data } = await apiClient.get(`/ai/articles/${articleId}/debate-summary`);
  return data;
}

/**
 * Fetch discussion starter prompt
 */
export async function getDiscussionStarter(
  articleId: string
): Promise<{ success: boolean; discussionStarter: string }> {
  const { data } = await apiClient.get(`/ai/articles/${articleId}/discussion-starter`);
  return data;
}
