import { Request, Response } from "express";
import { Like } from "../models/Like.js";
import { Article } from "../models/Article.js";

/**
 * GET /api/articles/:articleId/likes
 */
export async function getLikesByArticle(req: Request, res: Response): Promise<void> {
  try {
    const { articleId } = req.params;

    const count = await Like.countDocuments({ article: articleId });

    let isLiked = false;
    if (req.user) {
      const userLike = await Like.findOne({ article: articleId, user: req.user._id });
      isLiked = !!userLike;
    }

    res.json({ count, isLiked });
  } catch (error) {
    console.error("[Get Likes Error]:", error);
    res.status(500).json({ error: "Failed to fetch likes." });
  }
}

/**
 * POST /api/articles/:articleId/likes/toggle
 */
export async function toggleLike(req: Request, res: Response): Promise<void> {
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

    const existingLike = await Like.findOne({
      article: article._id,
      user: req.user._id,
    });

    let isLiked = false;

    if (existingLike) {
      await Like.findByIdAndDelete(existingLike._id);
      isLiked = false;
    } else {
      await Like.create({
        article: article._id,
        user: req.user._id,
      });
      isLiked = true;
    }

    const count = await Like.countDocuments({ article: articleId });

    res.json({ isLiked, count });
  } catch (error) {
    console.error("[Toggle Like Error]:", error);
    res.status(500).json({ error: "Failed to toggle like status." });
  }
}
