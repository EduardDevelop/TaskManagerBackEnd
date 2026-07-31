import { AppError } from "../middleware/error.middleware.js";
import { taskService } from "../services/task.service.js";
const getIdParam = (req) => {
    const { id } = req.params;
    if (!id) {
        throw new AppError("Task id is required", 400);
    }
    return id;
};
export const getTasks = async (_req, res, next) => {
    try {
        res.status(200).json(taskService.getAll());
    }
    catch (error) {
        next(error);
    }
};
export const getTask = async (req, res, next) => {
    try {
        const task = taskService.getById(getIdParam(req));
        if (!task) {
            throw new AppError("Task not found", 404);
        }
        res.status(200).json(task);
    }
    catch (error) {
        next(error);
    }
};
export const createTask = async (req, res, next) => {
    try {
        const task = taskService.create(req.body);
        res.status(201).json(task);
    }
    catch (error) {
        next(error);
    }
};
export const updateTask = async (req, res, next) => {
    try {
        const task = taskService.update(getIdParam(req), req.body);
        if (!task) {
            throw new AppError("Task not found", 404);
        }
        res.status(200).json(task);
    }
    catch (error) {
        next(error);
    }
};
export const deleteTask = async (req, res, next) => {
    try {
        const deleted = taskService.delete(getIdParam(req));
        if (!deleted) {
            throw new AppError("Task not found", 404);
        }
        res.status(200).json({ message: "Task deleted successfully" });
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=tasks.controller.js.map