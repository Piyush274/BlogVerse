import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

export const AI_CONFIG = {
  groqApiKey: process.env.GROQ_API_KEY || "",
  openRouterApiKey: process.env.OPENROUTER_API_KEY || "",
  openAiApiKey: process.env.OPENAI_API_KEY || "",
  defaultModel: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
  fastModel: process.env.GROQ_FAST_MODEL || "llama-3.1-8b-instant",
  embeddingModel: process.env.EMBEDDING_MODEL || "text-embedding-3-small",
};

let groqInstance: Groq | null = null;

export function getGroqClient(): Groq | null {
  if (!AI_CONFIG.groqApiKey) {
    return null;
  }
  if (!groqInstance) {
    groqInstance = new Groq({
      apiKey: AI_CONFIG.groqApiKey,
    });
  }
  return groqInstance;
}

export function isAiConfigured(): boolean {
  return Boolean(AI_CONFIG.groqApiKey || AI_CONFIG.openRouterApiKey || AI_CONFIG.openAiApiKey);
}
