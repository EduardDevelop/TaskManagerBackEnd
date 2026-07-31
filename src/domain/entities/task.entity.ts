import type { TaskStatus } from "../../shared/constants/task-status.constants.js";

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  createdAt: Date;
  updatedAt: Date;
}
