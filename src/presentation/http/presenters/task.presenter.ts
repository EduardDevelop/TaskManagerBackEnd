import type { Task } from "../../../domain/entities/task.entity.js";

const serializeTask = (task: Task) => ({
  ...task,
  createdAt: task.createdAt.toISOString(),
  updatedAt: task.updatedAt.toISOString(),
});

export const taskResponse = (task: Task) => ({ success: true, data: serializeTask(task) });
export const taskCollectionResponse = (tasks: Task[]) => ({
  success: true,
  data: tasks.map(serializeTask),
  meta: { total: tasks.length },
});
