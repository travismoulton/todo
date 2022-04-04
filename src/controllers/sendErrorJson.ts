import { Response } from 'express';

export default function sendErrorJson(
  res: Response,
  message: string,
  statusCode: number
) {
  res.status(statusCode).json({
    status: statusCode.toString().startsWith('4') ? 'fail' : 'error',
    data: { message },
  });
}
