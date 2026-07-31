import type { NextFunction, Request, Response } from "express";
import { TASK_STATUSES, type TaskStatus } from "../models/task.model.js";
import { AppError } from "./error.middleware.js";

const isValidStatus = (status: unknown): status is TaskStatus =>
  typeof status === "string" && TASK_STATUSES.includes(status as TaskStatus);

const validateTitle = (title: unknown): string => {
  if (typeof title !== "string" || title.trim().length === 0) {
    throw new AppError("Title is required and must be a non-empty string", 400);
  }

  if (title.trim().length > 100) {
    throw new AppError("Title must be 100 characters or less", 400);
  }

  return title.trim();
};

const validateDescription = (description: unknown): string | undefined => {
  if (description === undefined || description === null) {
    return undefined;
  }

  if (typeof description !== "string") {
    throw new AppError("Description must be a string", 400);
  }

  if (description.trim().length > 500) {
    throw new AppError("Description must be 500 characters or less", 400);
  }

  return description.trim();
};

const validateStatus = (status: unknown): TaskStatus => {
  if (!isValidStatus(status)) {
    throw new AppError("Status is required and must be one of: pending, in_progress, done", 400);
  }

  return status;
};

export const validateCreateTask = (req: Request, _res: Response, next: NextFunction) => {
  try {
    req.body = {
      title: validateTitle(req.body.title),
      description: validateDescription(req.body.description),
      status: validateStatus(req.body.status),
    };
    next();
  } catch (error) {
    next(error);
  }
};

export const validateUpdateTask = (req: Request, _res: Response, next: NextFunction) => {
  try {
    const hasTitle = Object.hasOwn(req.body, "title");
    const hasDescription = Object.hasOwn(req.body, "description");
    const hasStatus = Object.hasOwn(req.body, "status");

    if (!hasTitle && !hasDescription && !hasStatus) {
      throw new AppError("At least one field must be provided: title, description, status", 400);
    }

    req.body = {
      ...(hasTitle ? { title: validateTitle(req.body.title) } : {}),
      ...(hasDescription ? { description: validateDescription(req.body.description) } : {}),
      ...(hasStatus ? { status: validateStatus(req.body.status) } : {}),
    };
    next();
  } catch (error) {
    next(error);
  }
};
