import type { NextFunction, Request, Response } from "express";
export declare const getTasks: (_req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getTask: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const createTask: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const updateTask: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const deleteTask: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=tasks.controller.d.ts.map