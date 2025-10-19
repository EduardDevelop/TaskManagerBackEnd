import { BaseEntity } from "typeorm";
import type { User as UserType } from "./user.js";
import type { Task as TaskType } from "./tasks.js";
export type TaskStatus = "TO_DO" | "IN_PROGRESS" | "COMPLETED";
export declare class Task extends BaseEntity {
    id: number;
    title: string;
    description: string;
    status: TaskStatus;
    assignee: UserType;
    assigneeId: number | null;
    parent: TaskType;
    parentId: number | null;
    subtasks: TaskType[];
    createdAt: Date;
    updatedAt: Date;
    isParent(): boolean;
    isSubtask(): boolean;
}
//# sourceMappingURL=tasks.d.ts.map