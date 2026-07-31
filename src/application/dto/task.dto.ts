import type { TaskStatus } from "../../shared/constants/task-status.constants.js";

export interface CreateTaskDto {
  title: string;
  description?: string;
  status: TaskStatus;
}

export interface UpdateTaskDto {
  title: string;
  description?: string;
  status: TaskStatus;
}

export interface TaskQuery {
  search?: string;
  status?: TaskStatus;
}
