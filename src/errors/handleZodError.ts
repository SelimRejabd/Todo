import { ZodError, ZodIssue } from "zod";
import { TErrorSources, TGnericErrorResponse } from "../interface/error";

const handleZodError = (error: ZodError): TGnericErrorResponse => {
  const statusCode = 400;
  const errorSources: TErrorSources = error.issues.map((issue: ZodIssue) => {
    return {
      path: issue?.path[issue.path.length - 1],
      message: issue.message,
    };
  });
  const message: string =
    "Required " +
    error.issues
      .map((issue) => issue.path.filter((p) => p !== "body").join("."))
      .join(", ");
  return {
    statusCode,
    message: message || "Validation error",
    errorSources,
  };
};

export default handleZodError;
