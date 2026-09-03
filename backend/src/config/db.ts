import mongoose from "mongoose";
import dns from "node:dns";

export async function connectDB(): Promise<void> {
  try {
    dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
  } catch (e) {
    // Ignore if not permitted
  }

  const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/blogverse";

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`[MongoDB] Warning: Could not connect to ${mongoUri}. Please configure MONGODB_URI in backend/.env`);
  }
}

export function isDbConnected(): boolean {
  return mongoose.connection.readyState === 1;
}
