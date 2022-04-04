import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
// import { promisify } from 'util';
import jwt from 'jsonwebtoken';

import User, { IUser } from '../models/userModel';
import catchAsync from '../utils/catchAsync';
import sendErrorJson from './sendErrorJson';

dotenv.config({ path: './config.env' });

const { JWT_EXPIRES_IN, JWT_SECRET } = process.env;

function signToken(id: string) {
  jwt.sign({ id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

function createAndSendToken(
  user: IUser,
  statusCode: number,
  _req: Request,
  res: Response
) {
  const token = signToken(user._id);
  const ninetyDays = 90 * 24 * 60 * 60 * 1000;
  res.cookie('jwt', token, {
    expires: new Date(Date.now() + ninetyDays),
    httpOnly: true,
    // secure: true,
    sameSite: 'none',
  });

  // remove password from output
  user.password = '';

  res.status(statusCode).json({
    status: 'success',
    token,
    data: { user },
  });
}

interface LoginRequestBody {
  name: string;
  password: string;
}

export const signup = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { name, password } = req.body as LoginRequestBody;

    const existingUser = await User.find({ name: { $eq: name } });

    if (existingUser.length)
      return sendErrorJson(res, 'That email is already taken', 401);

    if (password.length < 8)
      return sendErrorJson(res, 'Password must be at least 8 charachters', 400);

    const newUser = await User.create({ name, password });

    createAndSendToken(newUser, 201, req, res);
  }
);

export const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, password } = req.body as LoginRequestBody;

    // Expirementing with using next(sendErrorJson)
    if (!name || !password)
      return next(sendErrorJson(res, 'Please provide an name and password', 400));

    const user = await User.findOne({ name }).select('+password');

    const passwordIsCorrect = user && (await user.correctPassword(password));

    if (!user || !passwordIsCorrect)
      return sendErrorJson(res, 'Incorrect name or password', 401);

    createAndSendToken(user, 200, req, res);
  }
);
