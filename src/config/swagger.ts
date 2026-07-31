import swaggerUi from "swagger-ui-express";
import type { Express } from "express";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import yaml from "yaml";

export const registerSwagger = (app: Express): void => {
  const contractPath = resolve(
    process.cwd(),
    "specs/001-task-management-api/contracts/openapi.yaml",
  );
  const document = yaml.parse(readFileSync(contractPath, "utf8"));
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(document));
};
