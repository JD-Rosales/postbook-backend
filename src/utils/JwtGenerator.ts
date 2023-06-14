import jwt from 'jsonwebtoken';
import { User } from '@prisma/client';

const generateToken = (user: Omit<User, 'password'>) => {
  return jwt.sign(user, process.env.SECRET_KEY as string, {
    expiresIn: '1d',
  });
};

export default generateToken;
