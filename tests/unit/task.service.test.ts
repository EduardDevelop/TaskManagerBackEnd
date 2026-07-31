import { describe, expect, it } from "vitest";
import { InMemoryTaskRepository } from "../../src/infrastructure/repositories/in-memory-task.repository.js";
import { TaskService } from "../../src/application/services/task.service.js";

describe("TaskService", () => {
  const setup = () => {
    const repository = new InMemoryTaskRepository();
    const firstTime = new Date("2026-07-30T20:00:00.000Z");
    const secondTime = new Date("2026-07-30T21:00:00.000Z");
    const times = [firstTime, secondTime];
    const service = new TaskService(
      repository,
      () => times.shift() ?? secondTime,
      () => "task-1",
    );
    return { service };
  };

  it("creates, updates, and deletes a task while preserving creation data", async () => {
    const { service } = setup();
    const created = await service.createTask({
      title: "  Write tests ",
      description: "  Details ",
      status: "pending",
    });
    const updated = await service.updateTask(created.id, {
      title: "Finish tests",
      description: "",
      status: "done",
    });

    expect(created.title).toBe("Write tests");
    expect(created.description).toBe("Details");
    expect(updated.createdAt).toEqual(created.createdAt);
    expect(updated.updatedAt).not.toEqual(created.updatedAt);
    expect(updated.description).toBeNull();

    await service.deleteTask(created.id);
    await expect(service.getTaskById(created.id)).rejects.toMatchObject({ code: "TASK_NOT_FOUND" });
  });

  it("returns filtered tasks", async () => {
    const { service } = setup();
    await service.createTask({ title: "Write tests", status: "pending" });
    expect((await service.listTasks({ search: "TESTS" })).length).toBe(1);
    expect((await service.listTasks({ status: "done" })).length).toBe(0);
  });
});
