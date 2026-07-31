import { timingSafeEqual } from "node:crypto";
import type { RequestHandler } from "express";
import { AppError } from "../../../shared/errors/app.error.js";
import type { AppConfig } from "../../../config/env.js";

export const authenticationMiddleware =
  (config: AppConfig): RequestHandler =>
  (request, _response, next) => {
    if (!config.AUTH_ENABLED) {
      next();
      return;
    }

    const header = request.header("authorization");
    const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;
    const expected = Buffer.from(config.API_TOKEN ?? "");
    const actual = Buffer.from(token ?? "");
    const valid = expected.length === actual.length && timingSafeEqual(expected, actual);

    if (!valid) {
      next(new AppError("UNAUTHORIZED", "Authentication is required.", 401));
      return;
    }

    next();
  };
