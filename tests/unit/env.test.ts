import { describe, expect, it } from "vitest";
import { loadConfig } from "../../src/config/env.js";

describe("environment configuration", () => {
  it("loads safe defaults", () => {
    expect(loadConfig({}).PORT).toBe(3000);
    expect(loadConfig({}).AUTH_ENABLED).toBe(false);
  });

  it("requires a token when authentication is enabled", () => {
    expect(() => loadConfig({ AUTH_ENABLED: "true" })).toThrow();
  });
});
