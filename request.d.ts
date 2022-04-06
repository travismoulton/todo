import { Request } from 'express';
import { IUser } from './src/models/userModel';

interface CustomRequest extends Request {
  user: IUser;
}

export default CustomRequest;
