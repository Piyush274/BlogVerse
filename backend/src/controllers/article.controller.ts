import { Request, Response } from "express";
import { z } from "zod";
import { UploadApiResponse } from "cloudinary";
import cloudinary from "../config/cloudinary.js";
import { Article } from "../models/Article.js";
import { Comment } from "../models/Comment.js";
import { Like } from "../models/Like.js";

const articleValidationSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title cannot exceed 100 characters"),
  category: z.string().min(1, "Category is required").max(50),
  content: z.string().min(10, "Content must be at least 10 characters"),
});

/**
 * Upload buffer to Cloudinary helper with base64 Data URL fallback
 */
async function uploadToCloudinary(file: Express.Multer.File): Promise<string> {
  const hasCloudinaryKeys =
    process.env.CLOUDINARY_CLOUD_NAME &&
    !process.env.CLOUDINARY_CLOUD_NAME.includes("placeholder") &&
    process.env.CLOUDINARY_API_KEY &&
    !process.env.CLOUDINARY_API_KEY.includes("placeholder");

  if (!hasCloudinaryKeys) {
    console.warn("[Cloudinary] Warning: Cloudinary keys not configured. Using base64 Data URL fallback.");
    const base64 = file.buffer.toString("base64");
    return `data:${file.mimetype};base64,${base64}`;
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "blogverse", resource_type: "auto" },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error("Cloudinary upload failed"));
        } else {
          resolve(result.secure_url);
        }
      }
    );
    uploadStream.end(file.buffer);
  });
}

import { isDbConnected } from "../config/db.js";

/**
 * GET /api/articles
 * Query params: search, category, page, limit
 */
export async function getArticles(req: Request, res: Response): Promise<void> {
  try {
    if (!isDbConnected()) {
      res.json({
        articles: [],
        total: 0,
        totalPages: 1,
        currentPage: 1,
        limit: 6,
        warning: "MongoDB is not connected yet. Please set MONGODB_URI in backend/.env",
      });
      return;
    }

    const search = (req.query.search as string) || "";
    const category = (req.query.category as string) || "";
    const page = Math.max(1, parseInt((req.query.page as string) || "1", 10));
    const limit = Math.max(1, parseInt((req.query.limit as string) || "6", 10));
    const skip = (page - 1) * limit;

    const filter: any = {};

    if (search.trim()) {
      filter.$or = [
        { title: { $regex: search.trim(), $options: "i" } },
        { category: { $regex: search.trim(), $options: "i" } },
      ];
    }

    if (category.trim() && category !== "All") {
      filter.category = { $regex: `^${category.trim()}$`, $options: "i" };
    }

    const [articles, total] = await Promise.all([
      Article.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("author", "name email imageUrl role"),
      Article.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json({
      articles,
      total,
      totalPages,
      currentPage: page,
      limit,
    });
  } catch (error) {
    console.error("[Get Articles Error]:", error);
    res.status(500).json({ error: "Failed to fetch articles." });
  }
}

/**
 * GET /api/articles/top
 * Returns latest 4 articles
 */
export async function getTopArticles(_req: Request, res: Response): Promise<void> {
  try {
    if (!isDbConnected()) {
      res.json([]);
      return;
    }

    const articles = await Article.find()
      .sort({ createdAt: -1 })
      .limit(4)
      .populate("author", "name email imageUrl role");

    res.json(articles);
  } catch (error) {
    console.error("[Get Top Articles Error]:", error);
    res.status(500).json({ error: "Failed to fetch top articles." });
  }
}

/**
 * GET /api/articles/:id
 */
export async function getArticleById(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    const article = await Article.findById(id).populate("author", "name email imageUrl role");

    if (!article) {
      res.status(404).json({ error: "Article not found." });
      return;
    }

    res.json(article);
  } catch (error) {
    console.error("[Get Article By ID Error]:", error);
    res.status(500).json({ error: "Failed to fetch article." });
  }
}

/**
 * POST /api/articles
 */
export async function createArticle(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Authentication required." });
      return;
    }

    // Validate request body
    const validation = articleValidationSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({
        error: "Validation failed.",
        errors: validation.error.flatten().fieldErrors,
      });
      return;
    }

    // Validate uploaded file
    if (!req.file) {
      res.status(400).json({
        error: "Validation failed.",
        errors: { featuredImage: ["Featured image is required."] },
      });
      return;
    }

    // Upload to Cloudinary (or Data URL fallback)
    const featuredImageUrl = await uploadToCloudinary(req.file);

    // Save article to MongoDB
    const newArticle = await Article.create({
      title: validation.data.title,
      category: validation.data.category,
      content: validation.data.content,
      featuredImage: featuredImageUrl,
      author: req.user._id,
    });

    const populatedArticle = await newArticle.populate("author", "name email imageUrl role");

    res.status(201).json(populatedArticle);
  } catch (error: any) {
    console.error("[Create Article Error]:", error);
    res.status(500).json({ error: error.message || "Failed to create article." });
  }
}

/**
 * PUT /api/articles/:id
 */
export async function updateArticle(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Authentication required." });
      return;
    }

    const { id } = req.params;
    const article = await Article.findById(id);

    if (!article) {
      res.status(404).json({ error: "Article not found." });
      return;
    }

    // Check ownership
    if (article.author.toString() !== req.user._id.toString()) {
      res.status(403).json({ error: "Forbidden: You are not the author of this article." });
      return;
    }

    const validation = articleValidationSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({
        error: "Validation failed.",
        errors: validation.error.flatten().fieldErrors,
      });
      return;
    }

    let imageUrl = article.featuredImage;

    // If new file provided, upload to Cloudinary (or fallback)
    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file);
    }

    article.title = validation.data.title;
    article.category = validation.data.category;
    article.content = validation.data.content;
    article.featuredImage = imageUrl;

    await article.save();
    const populated = await article.populate("author", "name email imageUrl role");

    res.json(populated);
  } catch (error: any) {
    console.error("[Update Article Error]:", error);
    res.status(500).json({ error: error.message || "Failed to update article." });
  }
}

/**
 * DELETE /api/articles/:id
 */
export async function deleteArticle(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Authentication required." });
      return;
    }

    const { id } = req.params;
    const article = await Article.findById(id);

    if (!article) {
      res.status(404).json({ error: "Article not found." });
      return;
    }

    // Check ownership
    if (article.author.toString() !== req.user._id.toString()) {
      res.status(403).json({ error: "Forbidden: You cannot delete this article." });
      return;
    }

    // Cascade delete comments and likes
    await Promise.all([
      Article.findByIdAndDelete(id),
      Comment.deleteMany({ article: id }),
      Like.deleteMany({ article: id }),
    ]);

    res.json({ message: "Article deleted successfully." });
  } catch (error) {
    console.error("[Delete Article Error]:", error);
    res.status(500).json({ error: "Failed to delete article." });
  }
}
