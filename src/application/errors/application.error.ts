import { AppError } from "../../shared/errors/app.error.js";

export class TaskNotFoundError extends AppError {
  constructor(id: string) {
    super("TASK_NOT_FOUND", `Task ${id} was not found.`, 404);
  }
}
