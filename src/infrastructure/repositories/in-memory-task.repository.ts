import type { TaskQuery } from "../../application/dto/task.dto.js";
import type { Task } from "../../domain/entities/task.entity.js";
import type { TaskRepository } from "../../domain/repositories/task.repository.js";

export class InMemoryTaskRepository implements TaskRepository {
  private readonly tasks = new Map<string, Task>();

  async findAll(query: TaskQuery = {}): Promise<Task[]> {
    return [...this.tasks.values()].filter((task) => {
      const matchesStatus = !query.status || task.status === query.status;
      const search = query.search?.toLowerCase();
      const matchesSearch =
        !search ||
        task.title.toLowerCase().includes(search) ||
        (task.description?.toLowerCase().includes(search) ?? false);
      return matchesStatus && matchesSearch;
    });
  }

  async findById(id: string): Promise<Task | null> {
    return this.tasks.get(id) ?? null;
  }
  async create(task: Task): Promise<Task> {
    this.tasks.set(task.id, task);
    return task;
  }
  async update(task: Task): Promise<Task> {
    this.tasks.set(task.id, task);
    return task;
  }
  async delete(id: string): Promise<boolean> {
    return this.tasks.delete(id);
  }
}
