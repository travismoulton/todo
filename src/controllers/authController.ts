import { Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import jwt, { JwtPayload } from 'jsonwebtoken';

import CustomRequest from '../../request';
import User, { IUser } from '../models/userModel';
import catchAsync from '../utils/catchAsync';
import sendErrorJson from '../utils/sendErrorJson';

dotenv.config({ path: './config.env' });

const { JWT_EXPIRES_IN, JWT_SECRET } = process.env;

function signToken(id: string) {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

function createAndSendToken(
  user: IUser,
  statusCode: number,
  _req: CustomRequest,
  res: Response
) {
  const token = signToken(user._id);
  const ninetyDays = 90 * 24 * 60 * 60 * 1000;
  res.cookie('jwt', token, {
    expires: new Date(Date.now() + ninetyDays),
    httpOnly: true,
    secure: true,
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
  async (req: CustomRequest, res: Response, _next: NextFunction) => {
    const { name, password } = req.body as LoginRequestBody;

    // Will return an array if one user if found
    const existingUser = await User.find({ name: { $eq: name } });

    if (existingUser.length)
      return sendErrorJson(res, 'That email is already taken', 400);

    if (password.length < 8)
      return sendErrorJson(res, 'Password must be at least 8 charachters', 400);

    const newUser = await User.create({ name, password });

    createAndSendToken(newUser, 201, req, res);
  }
);

export const login = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
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

export const logout = (_req: Request, res: Response) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
    // secure: true
  });

  res.status(200).json({ status: 'success' });
};

export const protectRoute = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    // Check for to see if bearer token or jwt exist
    const isBearerToken = !!req.headers.authorization?.startsWith('Bearer');

    const tokenIsCookie = !!req.cookies?.jwt;

    const token: string | null = isBearerToken
      ? req.headers.authorization?.split(' ')[1]
      : tokenIsCookie
      ? req.cookies.jwt
      : null;

    console.log({ token });
    console.log(req.cookies);

    if (!token) {
      return sendErrorJson(
        res,
        'You are not logged in! Please log in to get access',
        401
      );
    }

    // Verify the token
    const decodedToken = jwt.verify(token, JWT_SECRET) as JwtPayload;

    // Check if the user still exists
    const currentUser = await User.findById(decodedToken.id);

    if (!currentUser) {
      return next(
        sendErrorJson(res, 'The user belonging to this token no longer exists', 401)
      );
    }

    req.user = currentUser;

    console.log(req.user);

    next();
  }
);

export const checkIfUserIsLoggedIn = catchAsync(
  async (req: CustomRequest, res: Response, _next: NextFunction) => {
    const token: string | undefined = req.cookies?.jwt;

    const sendNoUserResponse = () => res.status(204).json({ status: 'No user found' });

    if (token && token === 'loggedout') {
      // Verify the token
      const decodedToken = jwt.verify(token, JWT_SECRET) as JwtPayload;

      const currentUser = await User.findById(decodedToken?.id);
      if (!currentUser) sendNoUserResponse();

      // All checks passed
      res.status(200).json({ status: 'Success', data: { user: currentUser } });
    } else {
      sendNoUserResponse();
    }
  }
);
