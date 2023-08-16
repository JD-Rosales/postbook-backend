import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { getUser } from '../services/AuthServices';
import { User } from '@prisma/client';
import errHandler from './ErrorHandler';
import CustomeError from '../utils/CustomeError';

type UserType = Omit<User, 'password'>;
export interface UserRequest extends Request {
  user: UserType;
}

const verifyJwt = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new CustomeError(401, 'No token');
    }

    const decoded = jwt.verify(
      token,
      process.env.SECRET_KEY as string
    ) as UserType;

    const user = await getUser(decoded.id);

    if (!user)
      return res.status(401).json({ message: 'Unauthorized, invalid user' });

    // attach user to the Request
    (req as UserRequest).user = decoded as UserType;

    next();
  } catch (error) {
    errHandler(error, res);
  }
};

export default verifyJwt;
