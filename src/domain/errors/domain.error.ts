import { AppError } from "../../shared/errors/app.error.js";

export class PersistenceError extends AppError {
  constructor() {
    super("PERSISTENCE_ERROR", "Task storage is unavailable.", 500);
  }
}
