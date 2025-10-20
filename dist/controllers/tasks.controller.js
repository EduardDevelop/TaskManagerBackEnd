import { AppDataSource } from "../db.js";
import { Task } from "../entities/tasks.js";
import { User } from "../entities/user.js";
import { getIO } from "../sockets/sockets.js";
async function computeProgressForTask(taskId) {
    const repo = AppDataSource.getRepository(Task);
    const total = await repo.count({ where: { parentId: taskId } });
    if (total === 0)
        return { completed: 0, total: 0, percent: 0 };
    const completed = await repo.count({ where: { parentId: taskId, status: "COMPLETED" } });
    const percent = Math.round((completed / total) * 100);
    return { completed, total, percent };
}
export const getTasks = async (req, res) => {
    try {
        const repo = AppDataSource.getRepository(Task);
        const include = req.query.include === "subtasks";
        const status = req.query.status || undefined;
        const assignee = req.query.assignee ? Number(req.query.assignee) : undefined;
        const page = Math.max(1, Number(req.query.page) || 1);
        const limit = Math.min(100, Number(req.query.limit) || 20);
        const skip = (page - 1) * limit;
        const where = { parentId: null };
        if (status)
            where.status = status;
        if (assignee)
            where.assigneeId = assignee;
        const [parents, total] = await repo.findAndCount({
            where,
            order: { id: "ASC" },
            skip,
            take: limit,
        });
        let data = [];
        if (include && parents.length) {
            const parentIds = parents.map((p) => p.id);
            const children = await repo.find({
                where: parentIds.map((pid) => ({ parentId: pid })),
                order: { id: "ASC" },
            });
            const childMap = new Map();
            for (const c of children) {
                const arr = childMap.get(c.parentId) || [];
                arr.push(c);
                childMap.set(c.parentId, arr);
            }
            for (const p of parents) {
                const childrenForParent = childMap.get(p.id) || [];
                const progress = await computeProgressForTask(p.id);
                data.push({ ...p, children: childrenForParent, progress });
            }
        }
        else {
            for (const p of parents) {
                const progress = await computeProgressForTask(p.id);
                data.push({ ...p, progress });
            }
        }
        return res.json({
            data,
            meta: { page, limit, total },
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};
export const getTask = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const repo = AppDataSource.getRepository(Task);
        const task = await repo.findOneBy({ id });
        if (!task)
            return res.status(404).json({ message: "Task not found" });
        const children = await repo.find({ where: { parentId: id }, order: { id: "ASC" } });
        const progress = await computeProgressForTask(id);
        return res.json({ task, children, progress });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};
export const createTask = async (req, res) => {
    const { title, description, status = "TO_DO", assigneeId = null, parentId = null } = req.body;
    if (!title || typeof title !== "string" || title.trim().length < 3) {
        return res.status(400).json({ message: "Title is required and must have at least 3 characters" });
    }
    const ALLOWED_STATUS = ["TO_DO", "IN_PROGRESS", "COMPLETED"];
    if (!ALLOWED_STATUS.includes(status)) {
        return res.status(400).json({ message: "Invalid status value" });
    }
    const repo = AppDataSource.getRepository(Task);
    const userRepo = AppDataSource.getRepository(User);
    try {
        if (parentId !== null && parentId !== undefined) {
            const parent = await repo.findOneBy({ id: parentId });
            if (!parent) {
                return res.status(400).json({ message: "Parent task not found" });
            }
            if (parent.parentId !== null) {
                return res.status(400).json({ message: "Parent must be a top-level task" });
            }
        }
        if (assigneeId !== null && assigneeId !== undefined) {
            const assignee = await userRepo.findOneBy({ id: assigneeId });
            if (!assignee) {
                return res.status(400).json({ message: "Assignee user not found" });
            }
        }
        const task = new Task();
        task.title = title.trim();
        task.description = description ?? null;
        task.status = status;
        task.assigneeId = assigneeId ?? null;
        task.parentId = parentId ?? null;
        const savedTask = await repo.save(task);
        const io = getIO();
        if (io)
            io.emit("task:created", { task: savedTask });
        return res.status(201).json({ task: savedTask });
    }
    catch (error) {
        console.error("Error creating task:", error);
        return res.status(500).json({ message: error.message });
    }
};
export const updateTask = async (req, res) => {
    const { id } = req.params;
    const taskId = parseInt(id, 10);
    const updates = req.body;
    const repo = AppDataSource.getRepository(Task);
    const userRepo = AppDataSource.getRepository(User);
    try {
        const task = await repo.findOneBy({ id: taskId });
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        const ALLOWED_STATUS = ["TO_DO", "IN_PROGRESS", "COMPLETED"];
        if (updates.status && !ALLOWED_STATUS.includes(updates.status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }
        if (updates.title && (typeof updates.title !== "string" || updates.title.trim().length < 3)) {
            return res.status(400).json({ message: "Title must have at least 3 characters" });
        }
        if (updates.assigneeId !== undefined && updates.assigneeId !== null) {
            const assignee = await userRepo.findOneBy({ id: updates.assigneeId });
            if (!assignee) {
                return res.status(400).json({ message: "Assignee user not found" });
            }
        }
        if (updates.parentId !== undefined) {
            if (updates.parentId === taskId) {
                return res.status(400).json({ message: "Task cannot be its own parent" });
            }
            if (updates.parentId !== null) {
                const parent = await repo.findOneBy({ id: updates.parentId });
                if (!parent) {
                    return res.status(400).json({ message: "Parent task not found" });
                }
                if (parent.parentId !== null) {
                    return res.status(400).json({ message: "Parent must be a top-level task" });
                }
            }
        }
        if (updates.status === "COMPLETED") {
            const subtasks = await repo.findBy({ parentId: taskId });
            const incompleteSubs = subtasks.filter((s) => s.status !== "COMPLETED");
            if (incompleteSubs.length > 0) {
                return res.status(400).json({ message: "Cannot complete task with incomplete subtasks" });
            }
        }
        await AppDataSource.transaction(async (manager) => {
            if (updates.title !== undefined)
                task.title = updates.title.trim();
            if (updates.description !== undefined)
                task.description = updates.description;
            if (updates.status !== undefined)
                task.status = updates.status;
            if (updates.assigneeId !== undefined)
                task.assigneeId = updates.assigneeId;
            if (updates.parentId !== undefined)
                task.parentId = updates.parentId;
            await manager.save(task);
        });
        const io = getIO();
        if (io)
            io.emit("task:updated", { id: task.id, task });
        return res.status(200).json({ task });
    }
    catch (error) {
        console.error("Error updating task:", error);
        return res.status(500).json({ message: error.message });
    }
};
export const deleteTask = async (req, res) => {
    const id = Number(req.params.id);
    const force = req.query.force === "true";
    const repo = AppDataSource.getRepository(Task);
    try {
        const task = await repo.findOneBy({ id });
        if (!task)
            return res.status(404).json({ message: "Task not found" });
        const childCount = await repo.count({ where: { parentId: id } });
        if (childCount > 0 && !force) {
            return res.status(400).json({ message: "Task has subtasks. Use ?force=true to delete cascade" });
        }
        await AppDataSource.manager.transaction(async (manager) => {
            if (childCount > 0) {
                await manager.delete(Task, { parentId: id });
            }
            await manager.delete(Task, { id });
        });
        const io = getIO();
        if (io)
            io.emit("task:deleted", { id });
        return res.sendStatus(204);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};
//# sourceMappingURL=tasks.controller.js.map