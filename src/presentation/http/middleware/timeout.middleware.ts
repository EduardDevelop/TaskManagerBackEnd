import type { RequestHandler } from "express";
import { AppError } from "../../../shared/errors/app.error.js";

export const timeoutMiddleware =
  (milliseconds: number): RequestHandler =>
  (request, response, next) => {
    const timer = setTimeout(
      () => next(new AppError("REQUEST_TIMEOUT", "The request timed out.", 408)),
      milliseconds,
    );
    response.on("finish", () => clearTimeout(timer));
    request.on("close", () => clearTimeout(timer));
    next();
  };
