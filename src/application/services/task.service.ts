import { randomUUID } from "node:crypto";
import { TaskNotFoundError } from "../errors/application.error.js";
import type { CreateTaskDto, TaskQuery, UpdateTaskDto } from "../dto/task.dto.js";
import type { Task } from "../../domain/entities/task.entity.js";
import type { TaskRepository } from "../../domain/repositories/task.repository.js";

export class TaskService {
  constructor(
    private readonly repository: TaskRepository,
    private readonly clock: () => Date = () => new Date(),
    private readonly idGenerator: () => string = randomUUID,
  ) {}

  listTasks(query: TaskQuery = {}): Promise<Task[]> {
    return this.repository.findAll(query);
  }

  async getTaskById(id: string): Promise<Task> {
    const task = await this.repository.findById(id);
    if (!task) throw new TaskNotFoundError(id);
    return task;
  }

  async createTask(input: CreateTaskDto): Promise<Task> {
    const now = this.clock();
    const task: Task = {
      id: this.idGenerator(),
      title: input.title.trim(),
      description: input.description?.trim() || null,
      status: input.status,
      createdAt: now,
      updatedAt: now,
    };
    return this.repository.create(task);
  }

  async updateTask(id: string, input: UpdateTaskDto): Promise<Task> {
    const current = await this.getTaskById(id);
    const updated: Task = {
      ...current,
      title: input.title.trim(),
      description: input.description?.trim() || null,
      status: input.status,
      updatedAt: this.clock(),
    };
    return this.repository.update(updated);
  }

  async deleteTask(id: string): Promise<void> {
    if (!(await this.repository.delete(id))) throw new TaskNotFoundError(id);
  }
}
