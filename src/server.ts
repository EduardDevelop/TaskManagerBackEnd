import { createApp } from "./app.js";
import { loadConfig } from "./config/env.js";

const config = loadConfig();
const { app, close } = createApp(config);
const server = app.listen(config.PORT, () => {
  console.info(`Server running on port ${config.PORT}`);
});

const shutdown = () => {
  server.close(() => {
    close();
    process.exit(0);
  });
};
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
