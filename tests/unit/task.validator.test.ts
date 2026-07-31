import { describe, expect, it } from "vitest";
import {
  createTaskSchema,
  taskIdSchema,
} from "../../src/presentation/http/validators/task.validator.js";

describe("task validation", () => {
  it("rejects invalid task fields and generated properties", () => {
    expect(createTaskSchema.safeParse({ title: " ", status: "blocked" }).success).toBe(false);
    expect(
      createTaskSchema.safeParse({ title: "Valid", status: "pending", id: "client-id" }).success,
    ).toBe(false);
  });

  it("requires UUID identifiers", () => {
    expect(taskIdSchema.safeParse({ id: "not-a-uuid" }).success).toBe(false);
    expect(taskIdSchema.safeParse({ id: "00000000-0000-4000-8000-000000000000" }).success).toBe(
      true,
    );
  });
});
