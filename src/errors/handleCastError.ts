import mongoose from "mongoose";
import { TErrorSources, TGnericErrorResponse } from "../interface/error";

const handleCastError = (
  error: mongoose.Error.CastError
): TGnericErrorResponse => {
  const errorSources: TErrorSources = [
    {
      path: error.path,
      message: error.message,
    },
  ];
  const statusCode = 400;

  return {
    statusCode,
    message: "Invalid ID",
    errorSources,
  };
};

export default handleCastError;
