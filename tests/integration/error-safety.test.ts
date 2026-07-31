import { describe, expect, it } from "vitest";
import request from "supertest";
import app from "../../src/app.js";

describe("safe error responses", () => {
  it("does not expose malformed JSON internals", async () => {
    const response = await request(app)
      .post("/api/tasks")
      .set("content-type", "application/json")
      .send("{ invalid")
      .expect(400);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
    expect(JSON.stringify(response.body)).not.toContain("SyntaxError");
  });
});
