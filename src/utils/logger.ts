import morgan from "morgan";
import { RequestHandler } from "express";

export const logger = {
  info: (...args: any[]) => console.log("[INFO]", ...args),
  error: (...args: any[]) => console.error("[ERROR]", ...args),
};

export const httpLogger = morgan("dev") as RequestHandler;
