import express from "express";
import morgan from "morgan";
import cors from "cors";
import userRoutes from "./routers/users.routes.js";
import tasksRoutes from "./routers/tasks.routes.js";

const app = express();

const allowedOrigins = [
  "https://taskmanagerfrontend-4c3j.onrender.com",
  "https://www.taskmanagerfrontend-4c3j.onrender.com",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

const corsOptions = {
  origin: function (origin, callback) {
    console.log("CORS origin incoming:", origin);
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error(`❌ Bloqueado por CORS: ${origin}`);
      callback(new Error("No autorizado por CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept", "X-Requested-With"],
};

app.use(cors(corsOptions));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, Accept, X-Requested-With");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(morgan("dev"));
app.use(express.json());

app.use("/api", userRoutes);
app.use("/api", tasksRoutes);

export default app;
