/* eslint-disable @typescript-eslint/no-explicit-any */
import { TErrorSources, TGnericErrorResponse } from "../interface/error";

const handleDuplicateError = (error: any): TGnericErrorResponse => {
  const match = error.errorResponse.errmsg.match(/"([^"]+)"/);
  const extractedMessage = match && match[1];
  const errorSources: TErrorSources = [
    {
      path: "",
      message: `${extractedMessage} is already exist.`,
    },
  ];
  const statusCode = 400;

  return {
    statusCode,
    message: `${extractedMessage} is already exist.`,
    errorSources,
  };
};

export default handleDuplicateError;
