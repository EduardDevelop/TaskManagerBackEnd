import { z } from "zod";
import { TASK_STATUSES } from "../../../shared/constants/task-status.constants.js";

const title = z.string().trim().min(1).max(100);
const description = z
  .string()
  .max(500)
  .optional()
  .nullable()
  .transform((value) => value?.trim() || undefined);
const status = z.enum(TASK_STATUSES);

export const createTaskSchema = z.object({ title, description, status }).strict();
export const updateTaskSchema = z.object({ title, description, status }).strict();
export const taskIdSchema = z.object({ id: z.string().uuid() });
export const taskQuerySchema = z
  .object({ search: z.string().trim().max(200).optional(), status: status.optional() })
  .strict();
