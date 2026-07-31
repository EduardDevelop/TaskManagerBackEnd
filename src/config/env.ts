import { z } from "zod";

const environmentSchema = z
  .object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    PORT: z.coerce.number().int().min(1).max(65535).default(3000),
    API_PREFIX: z.string().startsWith("/").default("/api"),
    DATABASE_PATH: z.string().min(1).default("./data/tasks.sqlite"),
    CORS_ORIGIN: z.string().url().default("http://localhost:4200"),
    REQUEST_TIMEOUT_MS: z.coerce.number().int().positive().default(10000),
    AUTH_ENABLED: z
      .enum(["true", "false"])
      .default("false")
      .transform((value) => value === "true"),
    API_TOKEN: z.string().optional(),
    LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace"]).default("info"),
  })
  .superRefine((value, context) => {
    if (value.AUTH_ENABLED && !value.API_TOKEN) {
      context.addIssue({
        code: "custom",
        path: ["API_TOKEN"],
        message: "API_TOKEN is required when AUTH_ENABLED=true",
      });
    }
  });

export type AppConfig = z.infer<typeof environmentSchema>;

export const loadConfig = (source: NodeJS.ProcessEnv = process.env): AppConfig =>
  environmentSchema.parse(source);
