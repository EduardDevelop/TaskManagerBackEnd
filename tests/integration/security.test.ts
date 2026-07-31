import { afterEach, describe, expect, it } from "vitest";
import request from "supertest";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { AppConfig } from "../../src/config/env.js";
import { createApp } from "../../src/app.js";

describe("security middleware", () => {
  const directories: string[] = [];
  afterEach(() => {
    for (const directory of directories.splice(0))
      rmSync(directory, { recursive: true, force: true });
  });

  it("applies configured CORS, security headers, and body limits", async () => {
    const directory = mkdtempSync(join(tmpdir(), "task-security-"));
    directories.push(directory);
    const config: AppConfig = {
      NODE_ENV: "test",
      PORT: 3000,
      API_PREFIX: "/api",
      DATABASE_PATH: join(directory, "tasks.sqlite"),
      CORS_ORIGIN: "http://allowed.example",
      REQUEST_TIMEOUT_MS: 10000,
      AUTH_ENABLED: false,
      LOG_LEVEL: "error",
    };
    const { app, close } = createApp(config);
    try {
      const response = await request(app)
        .get("/api/tasks")
        .set("Origin", "http://allowed.example")
        .expect(200);
      expect(response.headers["access-control-allow-origin"]).toBe("http://allowed.example");
      expect(response.headers["x-content-type-options"]).toBe("nosniff");
    } finally {
      close();
    }
  });
});
