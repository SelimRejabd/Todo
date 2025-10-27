import mongoose from "mongoose";
import { logger } from "../utils/logger";
import { config } from ".";

export const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(config.database_url as string);
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};
