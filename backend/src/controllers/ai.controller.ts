import { Request, Response, NextFunction } from "express";
import { AgentEditorialPipeline } from "../services/agent.service.js";
import { RagService } from "../services/rag.service.js";
import { ModerationService } from "../services/moderation.service.js";
import { Comment } from "../models/Comment.js";
import { Article } from "../models/Article.js";

/**
 * Streams the Multi-Agent Editorial Pipeline using Server-Sent Events (SSE).
 */
export async function generateEditorialStream(req: Request, res: Response, next: NextFunction) {
  try {
    const { topic, category, tone, targetLength } = req.body;

    if (!topic || typeof topic !== "string" || topic.trim().length < 3) {
      res.status(400).json({ error: "Topic is required (minimum 3 characters)" });
      return;
    }

    // Set headers for Server-Sent Events (SSE)
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders?.();

    const sendSSE = (event: string, data: any) => {
      res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
    };

    sendSSE("init", { message: "AI Agentic Pipeline initialized", topic });

    const result = await AgentEditorialPipeline.runPipeline(
      { topic, category, tone, targetLength },
      (stepLog) => {
        sendSSE("step", stepLog);
      }
    );

    sendSSE("complete", result);
    res.end();
  } catch (error) {
    next(error);
  }
}

/**
 * Non-streaming Multi-Agent generation endpoint.
 */
export async function generateEditorial(req: Request, res: Response, next: NextFunction) {
  try {
    const { topic, category, tone, targetLength } = req.body;
    if (!topic || typeof topic !== "string" || topic.trim().length < 3) {
      res.status(400).json({ error: "Topic is required (minimum 3 characters)" });
      return;
    }

    const result = await AgentEditorialPipeline.runPipeline({
      topic,
      category,
      tone,
      targetLength,
    });

    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

/**
 * Conversational RAG with Article context & citations.
 */
export async function chatWithArticle(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { question, history } = req.body;

    if (!question || typeof question !== "string" || question.trim().length < 2) {
      res.status(400).json({ error: "Question is required" });
      return;
    }

    const result = await RagService.chatWithArticle(id, question.trim(), history || []);
    res.json({ success: true, ...result });
  } catch (error: any) {
    if (error.message === "Article not found") {
      res.status(404).json({ error: "Article not found" });
      return;
    }
    next(error);
  }
}

/**
 * Instant Executive Summary & Key Takeaways for an Article.
 */
export async function getArticleSummary(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const article = await Article.findById(id);

    if (!article) {
      res.status(404).json({ error: "Article not found" });
      return;
    }

    if (article.aiSummary && article.aiKeyTakeaways && article.aiKeyTakeaways.length > 0) {
      res.json({
        success: true,
        summary: article.aiSummary,
        keyTakeaways: article.aiKeyTakeaways,
      });
      return;
    }

    const summaryResult = await RagService.summarizeContent(article.title, article.content);
    article.aiSummary = summaryResult.summary;
    article.aiKeyTakeaways = summaryResult.keyTakeaways;
    await article.save();

    res.json({
      success: true,
      summary: article.aiSummary,
      keyTakeaways: article.aiKeyTakeaways,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Synthesizes Community Debate Consensus & Perspectives from Comments.
 */
export async function getDebateSummary(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const article = await Article.findById(id);
    if (!article) {
      res.status(404).json({ error: "Article not found" });
      return;
    }

    const comments = await Comment.find({ article: id })
      .populate("author", "name")
      .sort({ createdAt: -1 })
      .limit(30)
      .lean();

    const formattedComments = comments.map((c: any) => ({
      content: c.body || c.content || "",
      authorName: c.author?.name || "Reader",
    }));

    const debate = await ModerationService.synthesizeDebate(article.title, formattedComments);
    res.json({ success: true, ...debate });
  } catch (error) {
    next(error);
  }
}

/**
 * Generates an AI discussion starter question.
 */
export async function getDiscussionStarter(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const article = await Article.findById(id);
    if (!article) {
      res.status(404).json({ error: "Article not found" });
      return;
    }

    const starter = await ModerationService.generateDiscussionStarter(
      article.title,
      article.category
    );

    res.json({ success: true, discussionStarter: starter });
  } catch (error) {
    next(error);
  }
}

/**
 * Semantic vector search for related articles.
 */
export async function semanticSearch(req: Request, res: Response, next: NextFunction) {
  try {
    const { query, articleId } = req.body;
    if (articleId) {
      const related = await RagService.findRelatedArticles(articleId, 4);
      res.json({ success: true, articles: related });
      return;
    }

    res.json({ success: true, articles: [] });
  } catch (error) {
    next(error);
  }
}
