// controllers/taskController.js
import { AppDataSource } from "../db.js";
import { Task } from "../entities/tasks.js";
import { User } from "../entities/user.js";
import { AppError } from "../utils/error.js";

export const getTasks = async (req:any, res:any, next:any) => {
  try {
    const { include, page = 1, limit = 100 } = req.query;
    const taskRepo = AppDataSource.getRepository(Task);

    const tasks = await taskRepo.find({
      relations: include === "subtasks" ? ["children", "user"] : ["user"],
      skip: (page - 1) * limit,
      take: parseInt(limit),
    });

    res.json({ data: tasks });
  } catch (err) {
    next(new AppError("Error fetching tasks", 500));
  }
};

export const createTask = async (req:any, res:any, next:any) => {
  try {
    const { title, description, status, assigneeId, parentId } = req.body;
    if (!title || title.trim().length < 3) {
      throw new AppError("Title must be at least 3 characters long", 400);
    }

    const taskRepo = AppDataSource.getRepository(Task);
    const userRepo = AppDataSource.getRepository(User);

    let assignee = null;
    if (assigneeId) {
      assignee = await userRepo.findOneBy({ id: assigneeId });
      if (!assignee) throw new AppError("Assignee not found", 404);
    }

    let parent = null;
    if (parentId) {
      parent = await taskRepo.findOneBy({ id: parentId });
      if (!parent) throw new AppError("Parent task not found", 404);
    }

    const task = taskRepo.create({
      title: title.trim(),
      description,
      status,
      user: assignee,
      parent,
    });

    const saved = await taskRepo.save(task);
    res.status(201).json(saved);
  } catch (err) {
    next(err);
  }
};

export const updateTask = async (req:any, res:any, next:any) => {
  try {
    const id = parseInt(req.params.id);
    const { title, description, status, assigneeId } = req.body;
    const taskRepo = AppDataSource.getRepository(Task);

    const task = await taskRepo.findOne({ where: { id }, relations: ["user"] });
    if (!task) throw new AppError("Task not found", 404);

    if (title && title.trim().length < 3)
      throw new AppError("Title must be at least 3 characters long", 400);

    if (assigneeId) {
      const userRepo = AppDataSource.getRepository(User);
      const assignee = await userRepo.findOneBy({ id: assigneeId });
      if (!assignee) throw new AppError("Assignee not found", 404);
      task.user = assignee;
    }

    task.title = title ?? task.title;
    task.description = description ?? task.description;
    task.status = status ?? task.status;

    const updated = await taskRepo.save(task);
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

export const deleteTask = async (req:any, res:any, next:any) => {
  try {
    const id = parseInt(req.params.id);
    const taskRepo = AppDataSource.getRepository(Task);

    const task = await taskRepo.findOneBy({ id });
    if (!task) throw new AppError("Task not found", 404);

    await taskRepo.remove(task);
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    next(err);
  }
};
