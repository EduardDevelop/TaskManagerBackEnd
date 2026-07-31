import express from "express";
import type { Express } from "express";
import { type AppConfig } from "./config/env.js";
export declare const createApp: (config?: AppConfig) => {
    app: Express;
    close: () => void;
};
declare const app: express.Express;
export default app;
//# sourceMappingURL=app.d.ts.map