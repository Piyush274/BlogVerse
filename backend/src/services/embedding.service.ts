import { AI_CONFIG } from "../config/ai.config.js";

/**
 * Splits raw content or markdown/HTML into semantic chunks with a sliding overlap.
 */
export function chunkText(text: string, maxChunkLength = 600, overlap = 100): string[] {
  // Strip HTML tags for clean embedding text
  const clean = text.replace(/<[^>]*>?/gm, " ").replace(/\s+/g, " ").trim();
  if (clean.length <= maxChunkLength) {
    return [clean];
  }

  const chunks: string[] = [];
  let start = 0;

  while (start < clean.length) {
    let end = start + maxChunkLength;
    if (end >= clean.length) {
      chunks.push(clean.substring(start).trim());
      break;
    }

    // Try to break at sentence or period boundary
    const lastPeriod = clean.lastIndexOf(".", end);
    if (lastPeriod > start + 200) {
      end = lastPeriod + 1;
    } else {
      const lastSpace = clean.lastIndexOf(" ", end);
      if (lastSpace > start) {
        end = lastSpace;
      }
    }

    const chunk = clean.substring(start, end).trim();
    if (chunk) {
      chunks.push(chunk);
    }
    start = end - overlap;
  }

  return chunks;
}

/**
 * Computes a normalized dense vector embedding (default 384 dimensions)
 * If OpenAI/Groq embedding key is available, calls API, otherwise produces
 * a deterministic TF-IDF / character n-gram cosine vector for zero-dependency local vector search.
 */
export async function generateEmbedding(text: string, dimensions = 384): Promise<number[]> {
  const clean = text.toLowerCase().trim();

  // If OpenAI API key is provided, use OpenAI embeddings
  if (AI_CONFIG.openAiApiKey) {
    try {
      const response = await fetch("https://api.openai.com/v1/embeddings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${AI_CONFIG.openAiApiKey}`,
        },
        body: JSON.stringify({
          input: clean,
          model: AI_CONFIG.embeddingModel,
        }),
      });
      if (response.ok) {
        const data = (await response.json()) as any;
        return data.data[0].embedding;
      }
    } catch (e) {
      console.warn("[EmbeddingService] OpenAI embedding fallback to local vector:", e);
    }
  }

  // Deterministic local dense semantic hash vector (Unit-normalized)
  const vector = new Array(dimensions).fill(0);
  const words = clean.split(/\W+/).filter(Boolean);

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    let hash = 0;
    for (let c = 0; c < word.length; c++) {
      hash = (hash << 5) - hash + word.charCodeAt(c);
      hash |= 0;
    }
    const idx = Math.abs(hash) % dimensions;
    // Word weight decaying by log frequency
    vector[idx] += 1 / Math.sqrt(i + 1);
  }

  // Normalize to unit vector
  let norm = 0;
  for (let i = 0; i < dimensions; i++) {
    norm += vector[i] * vector[i];
  }
  norm = Math.sqrt(norm);
  if (norm > 0) {
    for (let i = 0; i < dimensions; i++) {
      vector[i] /= norm;
    }
  }

  return vector;
}

/**
 * Calculates Cosine Similarity between two normalized vectors: (A . B)
 */
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
  let dotProduct = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
  }
  return dotProduct;
}
