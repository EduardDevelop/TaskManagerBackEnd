import { type Request, type Response } from "express";
type TaskStatus = "TO_DO" | "IN_PROGRESS" | "COMPLETED";
interface TaskBody {
    title: string;
    description: string;
    status: TaskStatus;
    assigneeId: number | null;
    parentId: number | null;
}
export declare const getTasks: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getTask: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createTask: (req: Request<unknown, unknown, TaskBody>, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateTask: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteTask: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export {};
//# sourceMappingURL=tasks.controller.d.ts.map