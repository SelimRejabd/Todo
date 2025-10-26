import { ForbiddenError } from "@casl/ability";
import { config } from "../../config";
import { TErrorSources, TGnericErrorResponse } from "../interface/error";

const handleForbiddenError = (
  error: ForbiddenError<any>
): TGnericErrorResponse => {
  const statusCode = 403;

  // Keep a safe, user-friendly message for prod
  const userMessage =
    "You don't have enough permission to perform this action.";

  // Slightly more specific message for dev (optional)
  const action = (error as any)?.action as string | undefined;
  const subjectType = (error as any)?.subjectType as string | undefined;
  const devMessage =
    action && subjectType
      ? `Forbidden: cannot ${action} on ${subjectType}`
      : "Forbidden";

  const message = config.node_env === "development" ? devMessage : userMessage;

  const errorSources: TErrorSources = [
    {
      path: "",
      message,
    },
  ];

  return {
    statusCode,
    message,
    errorSources,
  };
};

export default handleForbiddenError;
