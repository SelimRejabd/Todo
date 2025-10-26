import { Request, Response, NextFunction } from "express";
import catchAsync from "../utils/catchAsync";
import AppError from "../errors/AppError";

export const filterEmptyFields = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body || typeof req.body !== "object") {
      return next(new AppError("Invalid request body", 400));
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filtered: any = {};

    for (const [key, value] of Object.entries(req.body)) {
      const isFileArray =
        Array.isArray(value) && value.every((v) => typeof v === "string");
      const isNonEmptyFileArray = isFileArray && value.some((v) => v !== "");

      if (
        value !== null &&
        value !== "" &&
        value !== undefined &&
        (!isFileArray || isNonEmptyFileArray)
      ) {
        filtered[key] = value;
      }
    }

    req.body = filtered;
    next();
  }
);
