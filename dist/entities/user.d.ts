import { BaseEntity } from "typeorm";
import type { Task as TaskType } from "./tasks.js";
export declare class User extends BaseEntity {
    id: number;
    firstname: string;
    lastname: string;
    active: boolean;
    tasks: TaskType[];
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=user.d.ts.map