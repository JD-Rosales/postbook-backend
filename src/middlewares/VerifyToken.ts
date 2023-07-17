import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { userDetails } from '../services/UserServices';
import { User } from '@prisma/client';

type UserType = Omit<User, 'password'>;
export interface CustomRequest extends Request {
  user: UserType | JwtPayload;
}

const verifyJwt = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new Error();
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY as string) as
      | UserType
      | JwtPayload;

    const user = await userDetails(decoded.id);

    if (!user)
      return res.status(401).json({ message: 'Unauthorized, invalid user' });

    // attach User to the Request
    (req as CustomRequest).user = decoded as UserType | JwtPayload;

    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorize, invalid token' });
  }
};

export default verifyJwt;
