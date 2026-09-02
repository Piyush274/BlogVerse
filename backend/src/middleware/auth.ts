import { Request, Response, NextFunction } from "express";
import { User, IUser } from "../models/User.js";
import { verifyToken } from "../utils/jwt.js";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

/**
 * Helper to extract token from Authorization header or cookies
 */
function extractToken(req: Request): string | null {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    return req.headers.authorization.split(" ")[1];
  }
  if (req.cookies && req.cookies.token) {
    return req.cookies.token;
  }
  return null;
}

/**
 * Middleware: Requires a valid JWT token
 */
export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const token = extractToken(req);

    if (!token) {
      res.status(401).json({ error: "Unauthorized: Access token is missing." });
      return;
    }

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id);

    if (!user) {
      res.status(401).json({ error: "Unauthorized: User not found." });
      return;
    }

    req.user = user;
    next();
  } catch (error: any) {
    console.error("[Auth Middleware Error]:", error.message);
    res.status(401).json({ error: "Unauthorized: Invalid or expired token." });
  }
}

/**
 * Middleware: Optional authentication (attaches user if valid token exists)
 */
export async function optionalAuth(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const token = extractToken(req);
    if (token) {
      const decoded = verifyToken(token);
      const user = await User.findById(decoded.id);
      if (user) {
        req.user = user;
      }
    }
  } catch (error) {
    // Ignore errors for optional authentication
  }
  next();
}
