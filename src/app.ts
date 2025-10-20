import express from "express";
import morgan from "morgan";
import cors from "cors";
import userRoutes from "./routers/users.routes.js";
import tasksRoutes from "./routers/tasks.routes.js";

const app = express();


const allowedOrigins = [
  "https://taskmanager-frontend-l9ch1g2el-edward-numpaques-projects.vercel.app", 
  "http://localhost:3000", 
];

const corsOptions = {
  origin: function (origin:any, callback:any) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error(`❌ Bloqueado por CORS: ${origin}`);
      callback(new Error("No autorizado por CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(express.json());

// Rutas
app.use("/api", userRoutes);
app.use("/api", tasksRoutes);

export default app;
