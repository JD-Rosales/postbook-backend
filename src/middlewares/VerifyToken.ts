import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

interface CustomRequest extends Request {
  token: string | JwtPayload;
}

const verifyJwt = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new Error();
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY as string);

    (req as CustomRequest).token = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorize, invalid token' });
  }
};

export default verifyJwt;
