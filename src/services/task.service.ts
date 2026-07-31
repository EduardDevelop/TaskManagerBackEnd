import type { CreateTaskInput, Task, UpdateTaskInput } from "../models/task.model.js";

class TaskService {
  private tasks: Task[] = [];
  private nextId = 1;

  getAll(): Task[] {
    return [...this.tasks];
  }

  getById(id: string): Task | undefined {
    return this.tasks.find((task) => task.id === id);
  }

  create(input: CreateTaskInput): Task {
    const now = new Date().toISOString();
    const task: Task = {
      id: String(this.nextId),
      title: input.title.trim(),
      status: input.status,
      createdAt: now,
      updatedAt: now,
    };

    if (input.description !== undefined) {
      task.description = input.description.trim();
    }

    this.tasks.push(task);
    this.nextId += 1;

    return task;
  }

  update(id: string, input: UpdateTaskInput): Task | undefined {
    const task = this.getById(id);

    if (!task) {
      return undefined;
    }

    if (input.title !== undefined) {
      task.title = input.title.trim();
    }

    if (input.description !== undefined) {
      task.description = input.description.trim();
    }

    if (input.status !== undefined) {
      task.status = input.status;
    }

    task.updatedAt = new Date().toISOString();

    return task;
  }

  delete(id: string): boolean {
    const initialLength = this.tasks.length;
    this.tasks = this.tasks.filter((task) => task.id !== id);

    return this.tasks.length < initialLength;
  }
}

export const taskService = new TaskService();
