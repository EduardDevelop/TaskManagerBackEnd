import { afterEach, describe, expect, it } from "vitest";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { openDatabase } from "../../src/infrastructure/database/sqlite.js";
import { SqliteTaskRepository } from "../../src/infrastructure/repositories/sqlite-task.repository.js";
import type { Task } from "../../src/domain/entities/task.entity.js";

describe("SqliteTaskRepository", () => {
  const directories: string[] = [];
  afterEach(() => {
    for (const directory of directories.splice(0))
      rmSync(directory, { recursive: true, force: true });
  });

  it("persists and filters tasks with bound values", async () => {
    const directory = mkdtempSync(join(tmpdir(), "task-manager-"));
    directories.push(directory);
    const database = openDatabase(join(directory, "tasks.sqlite"));
    const repository = new SqliteTaskRepository(database);
    const task: Task = {
      id: "task-1",
      title: "Prepare README",
      description: "Document setup",
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await repository.create(task);
    expect((await repository.findById(task.id))?.title).toBe(task.title);
    expect((await repository.findAll({ search: "readme" })).length).toBe(1);
    expect((await repository.findAll({ search: "' OR 1=1 --" })).length).toBe(0);
    expect(await repository.delete(task.id)).toBe(true);
    expect(await repository.findById(task.id)).toBeNull();
    database.close();
  });
});
