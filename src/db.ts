import { DataSource } from "typeorm";
import { User } from "./entities/user.js";
import { Task } from "./entities/tasks.js";
export const AppDataSource = new DataSource({
type: 'postgres',
host: 'localhost',
username: 'postgres',
password: '123456',
port: 5432,
database: 'taskmanagerDB',
 synchronize: true,
  // logging: true,
  entities: [User,Task],
})