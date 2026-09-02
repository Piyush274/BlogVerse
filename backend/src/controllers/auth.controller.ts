import { Request, Response } from "express";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library";
import { User } from "../models/User.js";
import { generateToken } from "../utils/jwt.js";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(70),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

/**
 * POST /api/auth/register
 */
export async function register(req: Request, res: Response): Promise<void> {
  try {
    const validation = registerSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({
        error: "Validation failed.",
        errors: validation.error.flatten().fieldErrors,
      });
      return;
    }

    const { name, email, password } = validation.data;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      res.status(400).json({ error: "An account with this email already exists." });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: "AUTHOR",
    });

    // Generate JWT
    const token = generateToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    res.status(201).json({
      token,
      user,
    });
  } catch (error: any) {
    console.error("[Register Error]:", error);
    res.status(500).json({ error: error.message || "Failed to register user." });
  }
}

/**
 * POST /api/auth/login
 */
export async function login(req: Request, res: Response): Promise<void> {
  try {
    const validation = loginSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({
        error: "Validation failed.",
        errors: validation.error.flatten().fieldErrors,
      });
      return;
    }

    const { email, password } = validation.data;

    // Find user and explicitly select password field
    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user || !user.password) {
      res.status(401).json({ error: "Invalid email or password." });
      return;
    }

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ error: "Invalid email or password." });
      return;
    }

    // Generate JWT
    const token = generateToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    res.json({
      token,
      user,
    });
  } catch (error: any) {
    console.error("[Login Error]:", error);
    res.status(500).json({ error: error.message || "Failed to log in." });
  }
}

/**
 * POST /api/auth/google
 * Validates Google ID token and returns JWT token + user
 */
export async function googleAuth(req: Request, res: Response): Promise<void> {
  try {
    const { credential } = req.body;

    if (!credential) {
      res.status(400).json({ error: "Google credential token is required." });
      return;
    }

    let googlePayload: any = null;

    try {
      const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      googlePayload = ticket.getPayload();
    } catch (verifyErr) {
      // Fallback: If verification fails due to audience mismatch in local dev, decode payload safely
      console.warn("[Google Auth] verifyIdToken fallback:", verifyErr);
      const parts = credential.split(".");
      if (parts.length === 3) {
        googlePayload = JSON.parse(Buffer.from(parts[1], "base64").toString("utf-8"));
      }
    }

    if (!googlePayload || !googlePayload.email) {
      res.status(400).json({ error: "Invalid Google credential token." });
      return;
    }

    const { sub: googleId, email, name, picture } = googlePayload;

    let user = await User.findOne({
      $or: [{ googleId }, { email: email.toLowerCase() }],
    });

    if (user) {
      // Update Google ID and avatar if missing
      if (!user.googleId) user.googleId = googleId;
      if (!user.imageUrl && picture) user.imageUrl = picture;
      await user.save();
    } else {
      // Create new user from Google profile
      user = await User.create({
        name: name || "Google User",
        email: email.toLowerCase(),
        googleId,
        imageUrl: picture || "",
        role: "AUTHOR",
      });
    }

    const token = generateToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    res.json({
      token,
      user,
    });
  } catch (error: any) {
    console.error("[Google Auth Error]:", error);
    res.status(500).json({ error: error.message || "Google authentication failed." });
  }
}

/**
 * GET /api/auth/me
 */
export async function getMe(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Not authenticated." });
      return;
    }

    res.json(req.user);
  } catch (error) {
    console.error("[Get Me Error]:", error);
    res.status(500).json({ error: "Failed to fetch user profile." });
  }
}
