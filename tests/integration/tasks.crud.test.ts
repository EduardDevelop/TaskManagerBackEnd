import { afterEach, describe, expect, it } from "vitest";
import request from "supertest";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { AppConfig } from "../../src/config/env.js";
import { createApp } from "../../src/app.js";

describe("Task API CRUD", () => {
  const directories: string[] = [];
  afterEach(() => {
    for (const directory of directories.splice(0))
      rmSync(directory, { recursive: true, force: true });
  });

  const setup = () => {
    const directory = mkdtempSync(join(tmpdir(), "task-api-"));
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
    return createApp(config);
  };

  it("supports the task lifecycle", async () => {
    const { app, close } = setup();
    const created = await request(app)
      .post("/api/tasks")
      .send({ title: "Write tests", status: "pending" })
      .expect(201);
    expect(created.headers.location).toMatch(/^\/api\/tasks\//);
    expect(created.body.success).toBe(true);

    const id = created.body.data.id as string;
    await request(app).get(`/api/tasks/${id}`).expect(200);
    const updated = await request(app)
      .put(`/api/tasks/${id}`)
      .send({ title: "Finish tests", status: "done" })
      .expect(200);
    expect(updated.body.data.id).toBe(id);
    expect(updated.body.data.status).toBe("done");
    await request(app).delete(`/api/tasks/${id}`).expect(204);
    await request(app).get(`/api/tasks/${id}`).expect(404);
    close();
  });
});
