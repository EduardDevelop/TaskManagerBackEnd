import { afterEach, describe, expect, it } from "vitest";
import request from "supertest";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { AppConfig } from "../../src/config/env.js";
import { createApp } from "../../src/app.js";

describe("Task API validation and safe errors", () => {
  const directories: string[] = [];
  afterEach(() => {
    for (const directory of directories.splice(0))
      rmSync(directory, { recursive: true, force: true });
  });

  it("returns field details for invalid input and safe errors for missing resources", async () => {
    const directory = mkdtempSync(join(tmpdir(), "task-errors-"));
    directories.push(directory);
    const config: AppConfig = {
      NODE_ENV: "test",
      PORT: 3000,
      API_PREFIX: "/api",
      DATABASE_PATH: join(directory, "tasks.sqlite"),
      CORS_ORIGIN: "http://localhost:4200",
      REQUEST_TIMEOUT_MS: 10000,
      AUTH_ENABLED: false,
      LOG_LEVEL: "error",
    };
    const { app, close } = createApp(config);
    try {
      const invalid = await request(app)
        .post("/api/tasks")
        .send({ title: "   ", status: "blocked" })
        .expect(400);
      expect(invalid.body.success).toBe(false);
      expect(invalid.body.error.code).toBe("VALIDATION_ERROR");
      expect(invalid.body.error.requestId).toBeTruthy();
      await request(app).get("/api/tasks/not-a-uuid").expect(400);
      const missing = await request(app)
        .get("/api/tasks/00000000-0000-4000-8000-000000000000")
        .expect(404);
      expect(missing.body.error.code).toBe("TASK_NOT_FOUND");
      await request(app).get("/no-such-route").expect(404);
    } finally {
      close();
    }
  });
});
