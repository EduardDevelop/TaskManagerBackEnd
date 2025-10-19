import {} from "express";
import { Task } from "../entities/tasks.js";
export const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find();
        return res.json(tasks);
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
    }
};
export const getTask = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findOneBy({ id: parseInt(id) });
        if (!task)
            return res.status(404).json({ message: "Task not found" });
        return res.json(task);
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
    }
};
export const createTask = async (req, res) => {
    const { title, description, status, assigneeId, parentId } = req.body;
    const task = new Task();
    task.title = title;
    task.description = description;
    task.status = status;
    task.assigneeId = assigneeId;
    task.parentId = parentId;
    await task.save();
    return res.json(task);
};
export const updateTask = async (req, res) => {
    const { id } = req.params;
    try {
        const task = await Task.findOneBy({ id: parseInt(id) });
        if (!task)
            return res.status(404).json({ message: "Not task found" });
        await Task.update({ id: parseInt(id) }, req.body);
        return res.sendStatus(204);
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
    }
};
export const deleteTask = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await Task.delete({ id: parseInt(id) });
        if (result.affected === 0)
            return res.status(404).json({ message: "Task not found" });
        return res.sendStatus(204);
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
    }
};
//# sourceMappingURL=tasks.controller.js.map