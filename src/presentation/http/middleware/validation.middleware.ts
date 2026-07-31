import type { RequestHandler } from "express";
import type { ZodType } from "zod";
import { AppError, type ErrorDetail } from "../../../shared/errors/app.error.js";

const validate =
  (schema: ZodType, source: "body" | "params" | "query"): RequestHandler =>
  (request, response, next) => {
    const result = schema.safeParse(request[source]);
    if (!result.success) {
      const details: ErrorDetail[] = result.error.issues.map((issue) => ({
        field: issue.path.join(".") || source,
        message: issue.message,
      }));
      next(new AppError("VALIDATION_ERROR", "The submitted data is invalid.", 400, details));
      return;
    }
    if (source === "query") {
      response.locals.validatedQuery = result.data;
    } else {
      request[source] = result.data;
    }
    next();
  };

export const validateBody = (schema: ZodType): RequestHandler => validate(schema, "body");
export const validateParams = (schema: ZodType): RequestHandler => validate(schema, "params");
export const validateQuery = (schema: ZodType): RequestHandler => validate(schema, "query");
