import { Response, NextFunction } from 'express';

import catchAsync from '../utils/catchAsync';
import sendErrorJson from '../utils/sendErrorJson';
import CustomRequest from '../../request';
import Todo from '../models/todoModel';

export const createTodo = catchAsync(
  async (req: CustomRequest, res: Response, _next: NextFunction) => {
    const todo = await Todo.create({ ...req.body, user: req.user });

    res.status(201).json({ status: 'success', data: todo });
  }
);

export const getTodoById = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const todo = await Todo.findById(req.params.id);

    if (!todo) return next(sendErrorJson(res, 'No todo found with that id', 400));

    res.status(200).json({ status: 'success', data: todo });
  }
);

export const getAllUserTodos = catchAsync(
  async (req: CustomRequest, res: Response, _next: NextFunction) => {
    const todos = await Todo.find({ user: req.user });

    res.status(200).json({ status: 'success', data: todos });
  }
);

export const getUserTodosByCategory = catchAsync(
  async (req: CustomRequest, res: Response, _next: NextFunction) => {
    const todos = await Todo.find({ user: req.user });
  }
);
