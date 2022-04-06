import { Response, NextFunction } from 'express';

import catchAsync from '../utils/catchAsync';
import sendErrorJson from '../utils/sendErrorJson';
import CustomRequest from '../../request';
import Todo from '../models/todoModel';
import { ITodo } from '../models/todoModel';

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

export const getTodosByUser = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    // If any query paramaters are passed in, filter them
    const todos = await Todo.find({ user: req.user, ...req.query });

    res.status(200).json({ status: 'success', data: todos });
  }
);

export const deleteTodo = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    if (!(await Todo.findById(req.params.id)))
      return next(sendErrorJson(res, 'No todo with that ID exists', 400));

    await Todo.findByIdAndDelete(req.params.id);

    res.status(204).json({ status: 'success' });
  }
);

export const updateTodo = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const reqBody: ITodo = { ...req.body };

    // Do not allow the user and id field to be updated
    ['user', '_id', '__v'].forEach((prop) => delete reqBody[prop as keyof ITodo]);

    const todo = await Todo.findByIdAndUpdate(req.params.id, reqBody, {
      new: true,
      runValidators: true,
    });

    if (!todo) return next(sendErrorJson(res, 'No todo with that ID exists', 401));

    res.status(200).json({ status: 'success', data: todo });
  }
);
