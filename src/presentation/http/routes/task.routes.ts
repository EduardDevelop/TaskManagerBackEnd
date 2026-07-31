import { Router } from "express";
import type { TaskService } from "../../../application/services/task.service.js";
import {
  createTaskController,
  deleteTaskController,
  getTaskController,
  listTasksController,
  updateTaskController,
} from "../controllers/tasks.controller.js";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../middleware/validation.middleware.js";
import {
  createTaskSchema,
  taskIdSchema,
  taskQuerySchema,
  updateTaskSchema,
} from "../validators/task.validator.js";
import { authenticationMiddleware } from "../middleware/authentication.middleware.js";
import type { AppConfig } from "../../../config/env.js";

export const createTaskRouter = (service: TaskService, config: AppConfig): Router => {
  const router = Router();
  const auth = authenticationMiddleware(config);
  router.get("/", validateQuery(taskQuerySchema), listTasksController(service));
  router.get("/:id", validateParams(taskIdSchema), getTaskController(service));
  router.post("/", auth, validateBody(createTaskSchema), createTaskController(service));
  router.put(
    "/:id",
    auth,
    validateParams(taskIdSchema),
    validateBody(updateTaskSchema),
    updateTaskController(service),
  );
  router.delete("/:id", auth, validateParams(taskIdSchema), deleteTaskController(service));
  return router;
};
