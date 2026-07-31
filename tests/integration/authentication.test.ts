import { afterEach, describe, expect, it } from "vitest";
import request from "supertest";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { AppConfig } from "../../src/config/env.js";
import { createApp } from "../../src/app.js";

describe("Task API authentication", () => {
  const directories: string[] = [];
  afterEach(() => {
    for (const directory of directories.splice(0))
      rmSync(directory, { recursive: true, force: true });
  });

  it("protects mutations when enabled", async () => {
    const directory = mkdtempSync(join(tmpdir(), "task-auth-"));
    directories.push(directory);
    const config: AppConfig = {
      NODE_ENV: "test",
      PORT: 3000,
      API_PREFIX: "/api",
      DATABASE_PATH: join(directory, "tasks.sqlite"),
      CORS_ORIGIN: "http://localhost:4200",
      REQUEST_TIMEOUT_MS: 10000,
      AUTH_ENABLED: true,
      API_TOKEN: "test-token",
      LOG_LEVEL: "error",
    };
    const { app, close } = createApp(config);
    try {
      expect(
        (
          await request(app)
            .post("/api/tasks")
            .send({ title: "Blocked", status: "pending" })
            .expect(401)
        ).body.error.code,
      ).toBe("UNAUTHORIZED");
      await request(app)
        .post("/api/tasks")
        .set("Authorization", "Bearer test-token")
        .send({ title: "Allowed", status: "pending" })
        .expect(201);
      await request(app).get("/api/docs").redirects(1).expect(200);
    } finally {
      close();
    }
  });
});
