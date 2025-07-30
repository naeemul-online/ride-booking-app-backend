import mongoose from "mongoose";
import { TGenericErrorResponse } from "../middlewares/globalErrorHandler";

export const handlerCastError = (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  err: mongoose.Error.CastError
): TGenericErrorResponse => {
  return {
    statusCode: 400,
    message: "Invalid mongodb objectID. Please provide a valid ID",
  };
};