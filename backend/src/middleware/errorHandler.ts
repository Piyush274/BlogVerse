import { Request, Response, NextFunction } from "express";

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error("[Unhandled Error]:", err);

  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || "An internal server error occurred.";

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
}
