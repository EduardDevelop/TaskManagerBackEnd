import type { NextFunction, Request, Response } from "express";

interface HttpError extends Error {
  status?: number;
  statusCode?: number;
}

export class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode = 400,
  ) {
    super(message);
  }
}

export const notFoundHandler = (_req: Request, _res: Response, next: NextFunction) => {
  next(new AppError("Endpoint not found", 404));
};

export const errorHandler = (
  error: HttpError,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const rawStatusCode =
    error instanceof AppError ? error.statusCode : (error.status ?? error.statusCode);
  const statusCode =
    rawStatusCode && rawStatusCode >= 400 && rawStatusCode <= 599 ? rawStatusCode : 500;
  const message = statusCode === 500 ? "Internal server error" : error.message;

  res.status(statusCode).json({ message });
};
