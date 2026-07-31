import type { ErrorRequestHandler, RequestHandler } from "express";
import { AppError } from "../../../shared/errors/app.error.js";
import { logger } from "../../../shared/logger/logger.js";

export const notFoundMiddleware: RequestHandler = (_request, _response, next) =>
  next(new AppError("ROUTE_NOT_FOUND", "Route not found.", 404));

export const errorHandler: ErrorRequestHandler = (error: unknown, request, response, next) => {
  void next;
  const requestId = response.locals.requestId as string | undefined;
  if (error instanceof SyntaxError && "body" in error) {
    response.status(400).json({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Malformed JSON body.",
        ...(requestId ? { requestId } : {}),
      },
    });
    return;
  }
  if (error instanceof AppError) {
    response.status(error.statusCode).json({
      success: false,
      error: {
        code: error.code,
        message: error.message,
        ...(error.details.length ? { details: error.details } : {}),
        ...(requestId ? { requestId } : {}),
      },
    });
    return;
  }
  // Unexpected errors are logged for diagnosis but receive a deliberately generic response.
  logger.error(
    { err: error, method: request.method, path: request.path, requestId },
    "Unexpected request failure",
  );
  response.status(500).json({
    success: false,
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "An unexpected server error occurred.",
      ...(requestId ? { requestId } : {}),
    },
  });
};
