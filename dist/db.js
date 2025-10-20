// db.ts
import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entities/user.js";
import { Task } from "./entities/tasks.js";
import dotenv from "dotenv";
dotenv.config();
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
    throw new Error("DATABASE_URL no está definida. Define la variable de entorno o crea un .env");
}
export const AppDataSource = new DataSource({
    type: "postgres",
    url: databaseUrl,
    extra: {
        ssl: {
            rejectUnauthorized: false,
        },
    },
    synchronize: true,
    // logging: true,
    entities: [User, Task],
});
export default AppDataSource;
//# sourceMappingURL=db.js.map