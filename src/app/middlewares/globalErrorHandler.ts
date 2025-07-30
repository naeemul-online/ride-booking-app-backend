/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/AppError";
import { handlerCastError } from "../helpers/handleCastError";
import { handlerDuplicateError } from "../helpers/handleDuplicateError";
import { handleValidationCastError } from "../helpers/handleValidationError";
import { handleZodError } from "../helpers/handleZodError";

export interface TErrorSources {
  path: string;
  message: string;
}

export interface TGenericErrorResponse {
  statusCode: number;
  message: string;
  errorSources?: TErrorSources[];
}

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (envVars.NODE_ENV === "development") {
    console.log(err);
  }

  let errorSources: TErrorSources[] = [];
  let statusCode = 500;
  let message = "Something went wrong!!";

  // duplicate email check
  if (err.code === 11000) {
    const simplifiedError = handlerDuplicateError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
  }

  // cast error / Object Id error
  else if (err.name === "CastError") {
    const simplifiedCastError = handlerCastError(err);
    statusCode = simplifiedCastError.statusCode;
    message = simplifiedCastError.message;
  }

  // zod validation error
  else if (err.name === "ZodError") {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources as TErrorSources[];
  }

  // mongoose validation error
  else if (err.name === "ValidationError") {
    const simplifiedError = handleValidationCastError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources as TErrorSources[];
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof Error) {
    statusCode = 500;
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    // we will not directly putt the stack , we will keep it for development only
    // stack: err.stack
    err: envVars.NODE_ENV === "development" ? err : null,
    stack: envVars.NODE_ENV === "development" ? err.stack : null,
  });
};
