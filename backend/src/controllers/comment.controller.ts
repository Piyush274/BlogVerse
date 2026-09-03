import { Request, Response } from "express";
import { z } from "zod";
import { Comment } from "../models/Comment.js";
import { Article } from "../models/Article.js";
import { ModerationService } from "../services/moderation.service.js";

const commentValidationSchema = z.object({
  body: z.string().min(1, "Comment body cannot be empty").trim(),
});

/**
 * GET /api/articles/:articleId/comments
 */
export async function getCommentsByArticle(req: Request, res: Response): Promise<void> {
  try {
    const { articleId } = req.params;

    const comments = await Comment.find({ article: articleId })
      .sort({ createdAt: -1 })
      .populate("author", "name email imageUrl role");

    res.json(comments);
  } catch (error) {
    console.error("[Get Comments Error]:", error);
    res.status(500).json({ error: "Failed to fetch comments." });
  }
}

/**
 * POST /api/articles/:articleId/comments
 */
export async function createComment(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Authentication required." });
      return;
    }

    const { articleId } = req.params;
    const article = await Article.findById(articleId);

    if (!article) {
      res.status(404).json({ error: "Article not found." });
      return;
    }

    const validation = commentValidationSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({
        error: "Validation failed.",
        errors: validation.error.flatten().fieldErrors,
      });
      return;
    }

    // AI Safety & Moderation Guardrail Check
    const moderation = await ModerationService.checkCommentSafety(validation.data.body);
    if (!moderation.isSafe) {
      res.status(400).json({
        error: moderation.flagReason || "Comment flagged by AI safety moderation as violating community guidelines.",
        flaggedByAi: true,
      });
      return;
    }

    const newComment = await Comment.create({
      body: validation.data.body,
      article: article._id,
      author: req.user._id,
    });

    const populated = await newComment.populate("author", "name email imageUrl role");

    res.status(201).json(populated);
  } catch (error: any) {
    console.error("[Create Comment Error]:", error);
    res.status(500).json({ error: error.message || "Failed to create comment." });
  }
}

/**
 * DELETE /api/comments/:id
 */
export async function deleteComment(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Authentication required." });
      return;
    }

    const { id } = req.params;
    const comment = await Comment.findById(id);

    if (!comment) {
      res.status(404).json({ error: "Comment not found." });
      return;
    }

    if (comment.author.toString() !== req.user._id.toString()) {
      res.status(403).json({ error: "Forbidden: You cannot delete this comment." });
      return;
    }

    await Comment.findByIdAndDelete(id);
    res.json({ message: "Comment deleted successfully." });
  } catch (error) {
    console.error("[Delete Comment Error]:", error);
    res.status(500).json({ error: "Failed to delete comment." });
  }
}
