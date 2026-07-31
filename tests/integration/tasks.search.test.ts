import { afterEach, describe, expect, it } from "vitest";
import request from "supertest";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { AppConfig } from "../../src/config/env.js";
import { createApp } from "../../src/app.js";

describe("Task API search and filtering", () => {
  const directories: string[] = [];
  afterEach(() => {
    for (const directory of directories.splice(0))
      rmSync(directory, { recursive: true, force: true });
  });

  it("supports text, status, and combined filters", async () => {
    const directory = mkdtempSync(join(tmpdir(), "task-search-"));
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
      await request(app)
        .post("/api/tasks")
        .send({ title: "Documentation", description: "API guide", status: "pending" })
        .expect(201);
      await request(app).post("/api/tasks").send({ title: "Release", status: "done" }).expect(201);

      expect(
        (await request(app).get("/api/tasks?search= guide ").expect(200)).body.meta.total,
      ).toBe(1);
      expect(
        (await request(app).get("/api/tasks?status=pending").expect(200)).body.meta.total,
      ).toBe(1);
      expect(
        (await request(app).get("/api/tasks?search=api&status=pending").expect(200)).body.meta
          .total,
      ).toBe(1);
      expect(
        (await request(app).get("/api/tasks?status=blocked").expect(400)).body.error.code,
      ).toBe("VALIDATION_ERROR");
    } finally {
      close();
    }
  });
});
