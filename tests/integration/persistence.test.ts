import { describe, expect, it } from "vitest";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { openDatabase } from "../../src/infrastructure/database/sqlite.js";
import { SqliteTaskRepository } from "../../src/infrastructure/repositories/sqlite-task.repository.js";

describe("SQLite persistence", () => {
  it("retains a task after reopening the database", async () => {
    const directory = mkdtempSync(join(tmpdir(), "task-restart-"));
    const path = join(directory, "tasks.sqlite");
    const firstDatabase = openDatabase(path);
    const firstRepository = new SqliteTaskRepository(firstDatabase);
    const task = {
      id: "restart-task",
      title: "Persist me",
      description: null,
      status: "pending" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await firstRepository.create(task);
    firstDatabase.close();
    const secondDatabase = openDatabase(path);
    expect((await new SqliteTaskRepository(secondDatabase).findById(task.id))?.title).toBe(
      "Persist me",
    );
    secondDatabase.close();
    rmSync(directory, { recursive: true, force: true });
  });
});
