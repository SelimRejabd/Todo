import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import { httpLogger } from "./utils/logger";

import notFound from "./middleware/notFound";
import globalErrorHandler from "./middleware/globalErrorHandler";
import router from "./routes";

dotenv.config();

export const createApp = async (): Promise<Application> => {
  // Database
  await connectDB();

  const app = express();

  // Middlewares
  app.use(helmet()); // Security headers
  app.use(cors({ origin: "*" }));
  app.use(compression());
  app.use(express.json());
  app.use(httpLogger);

  // Routes
  app.use("/api/", router);

  // Health check
  app.get("/health", (_, res) => res.json({ status: "OK" }));

  // Error handling
  app.use(notFound);
  app.use(globalErrorHandler);

  return app;
};
