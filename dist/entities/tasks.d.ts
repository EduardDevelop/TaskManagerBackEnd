import { BaseEntity } from "typeorm";
export type TaskStatus = "TO_DO" | "IN_PROGRESS" | "COMPLETED";
export declare class Task extends BaseEntity {
    id: number;
    title: string;
    description: string;
    status: TaskStatus;
    user: any;
    assigneeId: number | null;
    parent: Task | null;
    parentId: number | null;
    subtasks: Task[];
    createdAt: Date;
    updatedAt: Date;
    isParent(): boolean;
    isSubtask(): boolean;
}
//# sourceMappingURL=tasks.d.ts.map