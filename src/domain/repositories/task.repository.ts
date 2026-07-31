import type { Task } from "../entities/task.entity.js";
import type { TaskQuery } from "../../application/dto/task.dto.js";

export interface TaskRepository {
  findAll(query?: TaskQuery): Promise<Task[]>;
  findById(id: string): Promise<Task | null>;
  create(task: Task): Promise<Task>;
  update(task: Task): Promise<Task>;
  delete(id: string): Promise<boolean>;
}
