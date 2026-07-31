import type { NextFunction, Request, Response } from "express";
import type { TaskQuery } from "../../../application/dto/task.dto.js";
import type { TaskService } from "../../../application/services/task.service.js";
import { taskCollectionResponse, taskResponse } from "../presenters/task.presenter.js";

const getId = (request: Request): string => {
  const id = request.params.id;
  if (!id) throw new Error("Task identifier is required");
  return id;
};

export const createTaskController =
  (service: TaskService) => async (request: Request, response: Response, next: NextFunction) => {
    try {
      const task = await service.createTask(request.body);
      response.status(201).location(`${request.baseUrl}/${task.id}`).json(taskResponse(task));
    } catch (error) {
      next(error);
    }
  };
export const listTasksController =
  (service: TaskService) => async (request: Request, response: Response, next: NextFunction) => {
    try {
      const query = (response.locals.validatedQuery ?? request.query) as TaskQuery;
      const tasks = await service.listTasks(query);
      response.status(200).json(taskCollectionResponse(tasks));
    } catch (error) {
      next(error);
    }
  };
export const getTaskController =
  (service: TaskService) => async (request: Request, response: Response, next: NextFunction) => {
    try {
      response.status(200).json(taskResponse(await service.getTaskById(getId(request))));
    } catch (error) {
      next(error);
    }
  };
export const updateTaskController =
  (service: TaskService) => async (request: Request, response: Response, next: NextFunction) => {
    try {
      response
        .status(200)
        .json(taskResponse(await service.updateTask(getId(request), request.body)));
    } catch (error) {
      next(error);
    }
  };
export const deleteTaskController =
  (service: TaskService) => async (request: Request, response: Response, next: NextFunction) => {
    try {
      await service.deleteTask(getId(request));
      response.status(204).send();
    } catch (error) {
      next(error);
    }
  };
