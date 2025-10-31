import express, { Application } from "express";
import cors, { CorsOptions } from "cors";
import helmet from "helmet";
import compression from "compression";
import { connectDB } from "./config/db";
import { httpLogger } from "./utils/logger";

import notFound from "./middleware/notFound";
import globalErrorHandler from "./middleware/globalErrorHandler";
import router from "./routes";
import { config } from "./config";

export const createApp = async (): Promise<Application> => {
  // Database
  await connectDB();

  const app = express();

  // CORS configuration
  const allowedOrigins = [config.local_frontend_url, config.prod_frontend_url];

  const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  };

  // Middlewares
  app.use(cors(corsOptions));
  app.use(helmet());
  app.use(compression());
  app.use(express.json());
  app.use(httpLogger);

  // Routes
  app.use("/api", router);

  // Health check
  app.get("/health", (_, res) => res.json({ status: "OK" }));

  // Error handling
  app.use(notFound);
  app.use(globalErrorHandler);

  return app;
};
