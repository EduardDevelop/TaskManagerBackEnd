import express from "express";
import morgan from "morgan";
import cors from "cors";
import userRoutes from "./routers/users.routes.js";
import tasksRoutes  from "./routers/tasks.routes.js";

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use("/api", userRoutes);
app.use("/api", tasksRoutes); 

export default app;