import { Request, Response } from "express";
import { Article } from "../models/Article.js";
import { Comment } from "../models/Comment.js";
import { Like } from "../models/Like.js";

/**
 * GET /api/dashboard/stats
 */
export async function getDashboardStats(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Authentication required." });
      return;
    }

    const userArticles = await Article.find({ author: req.user._id });
    const articleIds = userArticles.map((art) => art._id);

    // Total feedback/comments across all articles of this user
    const totalComments = await Comment.countDocuments({
      article: { $in: articleIds },
    });

    // Calculate dynamic average reading time
    const totalWords = userArticles.reduce((acc, art) => {
      const plainText = (art.content || "").replace(/<[^>]*>/g, "");
      return acc + plainText.split(/\s+/).filter(Boolean).length;
    }, 0);

    const avgReadingTime =
      userArticles.length > 0 ? Math.ceil(totalWords / (200 * userArticles.length)) : 0;

    res.json({
      totalArticles: userArticles.length,
      totalComments,
      avgReadingTime,
    });
  } catch (error) {
    console.error("[Dashboard Stats Error]:", error);
    res.status(500).json({ error: "Failed to fetch dashboard statistics." });
  }
}

/**
 * GET /api/dashboard/my-articles
 */
export async function getUserArticles(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Authentication required." });
      return;
    }

    const articles = await Article.find({ author: req.user._id })
      .sort({ createdAt: -1 })
      .populate("author", "name email imageUrl role");

    // Augment with comments and likes counts
    const articleIds = articles.map((a) => a._id);
    const [comments, likes] = await Promise.all([
      Comment.find({ article: { $in: articleIds } }),
      Like.find({ article: { $in: articleIds } }),
    ]);

    const articlesWithCounts = articles.map((art) => {
      const artObj: any = art.toJSON();
      artObj.comments = comments.filter((c) => c.article.toString() === art._id.toString());
      artObj.likes = likes.filter((l) => l.article.toString() === art._id.toString());
      return artObj;
    });

    res.json(articlesWithCounts);
  } catch (error) {
    console.error("[Get User Articles Error]:", error);
    res.status(500).json({ error: "Failed to fetch user articles." });
  }
}
