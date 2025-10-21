import express from "express";
import morgan from "morgan";
import cors from "cors";
import userRoutes from "./routers/users.routes.js";
import tasksRoutes from "./routers/tasks.routes.js";
const app = express();
// ORIGINS: SIN SLASH FINAL
const allowedOrigins = [
    "https://taskmanager-frontend-g00houece-edward-numpaques-projects.vercel.app",
    "http://localhost:3000",
];
// CORS OPTIONS con logging para debug
const corsOptions = {
    origin: function (origin, callback) {
        console.log("CORS origin incoming:", origin); // <--- ver en logs de Vercel
        // Allow requests with no origin (like server-to-server or curl)
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        else {
            console.error(`❌ Bloqueado por CORS: ${origin}`);
            return callback(new Error("No autorizado por CORS"));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept", "X-Requested-With"],
};
// APLICAR CORS
app.use(cors(corsOptions));
// Asegurar respuesta a preflight OPTIONS
app.options("*", cors(corsOptions));
app.use(morgan("dev"));
app.use(express.json());
// Rutas
app.use("/api", userRoutes);
app.use("/api", tasksRoutes);
export default app;
//# sourceMappingURL=app.js.map