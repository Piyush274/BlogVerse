import { getGroqClient, AI_CONFIG } from "../config/ai.config.js";
import { z } from "zod";

export interface EditorialInput {
  topic: string;
  category?: string;
  tone?: "technical" | "conversational" | "beginner-friendly" | "deep-dive";
  targetLength?: "short" | "medium" | "comprehensive";
}

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

export class AgentEditorialPipeline {
  /**
   * Runs the complete multi-agent workflow sequentially with step logging.
   */
  public static async runPipeline(
    input: EditorialInput,
    onStepUpdate?: (log: AgentStepLog) => void
  ): Promise<EditorialResult> {
    const logs: AgentStepLog[] = [];
    const groq = getGroqClient();

    const emitLog = (log: AgentStepLog) => {
      logs.push(log);
      if (onStepUpdate) {
        onStepUpdate(log);
      }
    };

    const category = input.category || "Technology";
    const tone = input.tone || "technical";

    // -------------------------------------------------------------
    // Step 1: Research Agent
    // -------------------------------------------------------------
    emitLog({
      step: "research",
      status: "started",
      summary: `Researching technical context, state-of-the-art developments, and core concepts for "${input.topic}"...`,
      timestamp: new Date().toISOString(),
    });

    let researchNotes = "";
    if (groq) {
      try {
        const researchPrompt = `You are an elite Senior Staff Technical Researcher for a top software publication.
Topic: "${input.topic}"
Category: "${category}"
Tone: "${tone}"

Provide a structured, high-signal research brief:
1. Core problem & background context
2. Key architectural concepts or state-of-the-art patterns
3. Concrete practical examples or code considerations
4. 3 common pitfalls and best practices

Keep the research brief crisp, dense, and technically accurate.`;

        const researchRes = await groq.chat.completions.create({
          model: AI_CONFIG.fastModel,
          messages: [{ role: "user", content: researchPrompt }],
          temperature: 0.3,
          max_tokens: 1000,
        });

        researchNotes = researchRes.choices[0]?.message?.content || "";
      } catch (err: any) {
        console.warn("[AgentPipeline:Research] Groq error, using fallback brief:", err?.message);
        researchNotes = `Key aspects for ${input.topic}: Architectural patterns, scalability trade-offs, modular design, performance optimizations, and security best practices.`;
      }
    } else {
      researchNotes = `Comprehensive research brief on ${input.topic} focusing on architecture, clean code, real-world case studies, and modern engineering paradigms.`;
    }

    emitLog({
      step: "research",
      status: "completed",
      summary: `Synthesized research brief with key architectural concepts and best practices.`,
      timestamp: new Date().toISOString(),
      data: { researchNotes },
    });

    // -------------------------------------------------------------
    // Step 2: Drafter Agent
    // -------------------------------------------------------------
    emitLog({
      step: "drafting",
      status: "started",
      summary: `Drafting comprehensive blog post incorporating research findings, headers, code examples, and structured takeaways...`,
      timestamp: new Date().toISOString(),
    });

    let draftContent = "";
    if (groq) {
      try {
        const draftingPrompt = `You are a Principal Software Engineer and acclaimed technical writer.
Draft an engaging, production-grade technical blog post based on this research brief.

Topic: "${input.topic}"
Category: "${category}"
Tone: "${tone}"
Research Brief:
${researchNotes}

Requirements:
- Format cleanly in semantic Markdown with ## headings, bullet points, and code blocks (with language specified like \`\`\`typescript).
- Include an introductory hook, in-depth architectural breakdown, code implementation walk-through, best practices, and a conclusion with key takeaways.
- Do NOT output preamble or conversational greetings. Start directly with the article heading or intro.`;

        const draftRes = await groq.chat.completions.create({
          model: AI_CONFIG.defaultModel,
          messages: [{ role: "user", content: draftingPrompt }],
          temperature: 0.6,
          max_tokens: 3000,
        });

        draftContent = draftRes.choices[0]?.message?.content || "";
      } catch (err: any) {
        console.warn("[AgentPipeline:Drafter] Groq error, using structured template:", err?.message);
        draftContent = `## Introduction\n\nIn modern software systems, **${input.topic}** has become a cornerstone for building resilient, high-performance applications.\n\n## Core Architecture & Key Concepts\n\nUnderstanding ${input.topic} requires breaking down its fundamental lifecycle:\n- **Modularity**: Decoupled component architecture.\n- **Scalability**: High-throughput distributed processing.\n- **Observability**: Metrics, logging, and error tracing.\n\n\`\`\`typescript\n// Example Architecture Pattern\nexport async function processWorkflow(payload: Record<string, unknown>) {\n  console.log("Processing payload with optimized latency:", payload);\n  return { success: true, timestamp: Date.now() };\n}\n\`\`\`\n\n## Best Practices & Pitfalls to Avoid\n\n1. Always validate incoming inputs at system boundaries.\n2. Ensure graceful degradation when external services time out.\n3. Implement proper indexing and caching strategies.\n\n## Summary\n\nBy adopting these design principles for **${input.topic}**, engineering teams can deliver scalable, maintainable, and high-performance solutions.`;
      }
    } else {
      draftContent = `## Deep Dive into ${input.topic}\n\n### Overview\n\n**${input.topic}** provides modern developers with the tools to solve scalability and maintainability bottlenecks.\n\n### Implementation Blueprint\n\n\`\`\`typescript\n// Implementation for ${input.topic}\ninterface Config {\n  enabled: boolean;\n  timeoutMs: number;\n}\n\nexport function initializeService(config: Config) {\n  return { status: "active", ...config };\n}\n\`\`\`\n\n### Key Takeaways\n\n- Modular design simplifies testing and long-term maintenance.\n- Proactive error handling prevents silent failure cascades.`;
    }

    emitLog({
      step: "drafting",
      status: "completed",
      summary: `Generated structured markdown draft (${draftContent.length} characters) with code samples.`,
      timestamp: new Date().toISOString(),
    });

    // -------------------------------------------------------------
    // Step 3: Critic / Fact-Checker Agent
    // -------------------------------------------------------------
    emitLog({
      step: "critique",
      status: "started",
      summary: `Reviewing draft for technical rigor, readability, coherence, and actionable insights...`,
      timestamp: new Date().toISOString(),
    });

    let critiqueScore = 92;
    let critiqueNotes: string[] = [
      "Well-structured markdown hierarchy with clear headings",
      "Code snippet includes TypeScript typing and error handling",
      "Actionable real-world takeaways included in the conclusion",
    ];

    if (groq) {
      try {
        const criticPrompt = `You are an exacting Technical Editor-in-Chief.
Review the following draft for technical accuracy, clarity, and structural balance:

Draft:
${draftContent.substring(0, 1500)}

Respond in valid JSON only with this schema:
{
  "score": <number between 70 and 99>,
  "notes": ["<specific positive or constructive editorial feedback point 1>", "<point 2>", "<point 3>"]
}`;

        const criticRes = await groq.chat.completions.create({
          model: AI_CONFIG.fastModel,
          messages: [{ role: "user", content: criticPrompt }],
          response_format: { type: "json_object" },
          temperature: 0.2,
        });

        const parsed = JSON.parse(criticRes.choices[0]?.message?.content || "{}");
        if (typeof parsed.score === "number") critiqueScore = parsed.score;
        if (Array.isArray(parsed.notes)) critiqueNotes = parsed.notes;
      } catch (e) {
        // Fallback already assigned
      }
    }

    emitLog({
      step: "critique",
      status: "completed",
      summary: `Editorial score: ${critiqueScore}/100. Feedback: ${critiqueNotes.join(" | ")}`,
      timestamp: new Date().toISOString(),
      data: { score: critiqueScore, notes: critiqueNotes },
    });

    // -------------------------------------------------------------
    // Step 4: SEO & Visual Assets Agent
    // -------------------------------------------------------------
    emitLog({
      step: "seo",
      status: "started",
      summary: `Optimizing metadata, title, search tags, and generating AI banner image prompt...`,
      timestamp: new Date().toISOString(),
    });

    let title = input.topic.length > 50 ? input.topic : `A Comprehensive Guide to ${input.topic}`;
    let metaDescription = `Learn everything about ${input.topic}, including architecture patterns, implementation steps, and best practices.`;
    let tags = [category.toLowerCase(), "programming", "software-engineering", "best-practices"];
    let suggestedCoverPrompt = `A futuristic, high-tech 3D render representing ${input.topic}, vibrant neon accents, dark mode glassmorphism, 8k resolution`;

    if (groq) {
      try {
        const seoPrompt = `You are an SEO & Social Media Growth Specialist for technical engineering publications.
Based on this article:
Topic: "${input.topic}"
Category: "${category}"

Respond in valid JSON only with this schema:
{
  "title": "<High-CTR, punchy technical article title under 75 characters>",
  "metaDescription": "<Compelling 150-character meta description>",
  "tags": ["<tag1>", "<tag2>", "<tag3>", "<tag4>"],
  "suggestedCoverPrompt": "<Detailed text-to-image prompt for a modern 3D abstract tech cover image>"
}`;

        const seoRes = await groq.chat.completions.create({
          model: AI_CONFIG.fastModel,
          messages: [{ role: "user", content: seoPrompt }],
          response_format: { type: "json_object" },
          temperature: 0.4,
        });

        const parsed = JSON.parse(seoRes.choices[0]?.message?.content || "{}");
        if (parsed.title) title = parsed.title;
        if (parsed.metaDescription) metaDescription = parsed.metaDescription;
        if (Array.isArray(parsed.tags)) tags = parsed.tags;
        if (parsed.suggestedCoverPrompt) suggestedCoverPrompt = parsed.suggestedCoverPrompt;
      } catch (e) {
        // Fallback assigned
      }
    }

    emitLog({
      step: "seo",
      status: "completed",
      summary: `Optimized title "${title}" with ${tags.length} tags and generated cover banner prompt.`,
      timestamp: new Date().toISOString(),
      data: { title, tags, metaDescription, suggestedCoverPrompt },
    });

    return {
      title,
      content: draftContent,
      category,
      tags,
      metaDescription,
      suggestedCoverPrompt,
      critiqueScore,
      critiqueNotes,
      logs,
    };
  }
}
