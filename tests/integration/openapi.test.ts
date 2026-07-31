import { describe, expect, it } from "vitest";
import request from "supertest";
import app from "../../src/app.js";

describe("OpenAPI documentation", () => {
  it("serves the interactive documentation", async () => {
    const response = await request(app).get("/api/docs").redirects(1).expect(200);
    expect(response.text).toContain("swagger-ui");
  });
});
