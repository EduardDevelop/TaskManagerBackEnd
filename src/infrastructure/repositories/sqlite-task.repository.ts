import type { TaskQuery } from "../../application/dto/task.dto.js";
import type { Task } from "../../domain/entities/task.entity.js";
import type { TaskRepository } from "../../domain/repositories/task.repository.js";
import { PersistenceError } from "../../domain/errors/domain.error.js";
import type { SqliteDatabase } from "../database/sqlite.js";

type TaskRow = {
  id: string;
  title: string;
  description: string | null;
  status: Task["status"];
  created_at: string;
  updated_at: string;
};

const toTask = (row: TaskRow): Task => ({
  id: row.id,
  title: row.title,
  description: row.description,
  status: row.status,
  createdAt: new Date(row.created_at),
  updatedAt: new Date(row.updated_at),
});

export class SqliteTaskRepository implements TaskRepository {
  constructor(private readonly database: SqliteDatabase) {}

  async findAll(query: TaskQuery = {}): Promise<Task[]> {
    try {
      const predicates: string[] = [];
      const parameters: Record<string, string> = {};
      if (query.search) {
        // Escape LIKE metacharacters so search input remains literal data.
        predicates.push(
          "(LOWER(title) LIKE LOWER(@search) ESCAPE '\\' OR LOWER(COALESCE(description, '')) LIKE LOWER(@search) ESCAPE '\\')",
        );
        parameters.search = `%${query.search.replace(/[\\%_]/g, "\\$&").toLowerCase()}%`;
      }
      if (query.status) {
        predicates.push("status = @status");
        parameters.status = query.status;
      }
      const where = predicates.length ? `WHERE ${predicates.join(" AND ")}` : "";
      const rows = this.database
        .prepare(`SELECT * FROM tasks ${where} ORDER BY created_at ASC`)
        .all(parameters) as TaskRow[];
      return rows.map(toTask);
    } catch {
      throw new PersistenceError();
    }
  }

  async findById(id: string): Promise<Task | null> {
    try {
      const row = this.database.prepare("SELECT * FROM tasks WHERE id = ?").get(id) as
        TaskRow | undefined;
      return row ? toTask(row) : null;
    } catch {
      throw new PersistenceError();
    }
  }

  async create(task: Task): Promise<Task> {
    try {
      this.database
        .prepare(
          "INSERT INTO tasks (id, title, description, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
        )
        .run(
          task.id,
          task.title,
          task.description,
          task.status,
          task.createdAt.toISOString(),
          task.updatedAt.toISOString(),
        );
      return task;
    } catch {
      throw new PersistenceError();
    }
  }

  async update(task: Task): Promise<Task> {
    try {
      const result = this.database
        .prepare(
          "UPDATE tasks SET title = ?, description = ?, status = ?, updated_at = ? WHERE id = ?",
        )
        .run(task.title, task.description, task.status, task.updatedAt.toISOString(), task.id);
      if (result.changes === 0) throw new PersistenceError();
      return task;
    } catch (error) {
      if (error instanceof PersistenceError) throw error;
      throw new PersistenceError();
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      return this.database.prepare("DELETE FROM tasks WHERE id = ?").run(id).changes > 0;
    } catch {
      throw new PersistenceError();
    }
  }
}
