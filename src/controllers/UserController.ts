import type { Request, Response, NextFunction } from 'express';
import * as UserServices from '../services/UserServices';
import z from 'zod';
import bcrypt from 'bcrypt';

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id: number = parseInt(req.params.id);

    const user = await UserServices.userDetails(id);

    if (user) return res.status(200).json(user);
    else return res.status(404).json({ message: 'No user found' });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  try {
    if (await UserServices.checkEmail(email)) {
      return res.status(409).json({ message: 'Email is already registered' });
    }

    // hash the password
    const hashPassword = bcrypt.hashSync(password, 10);

    const user = await UserServices.register({ email, password: hashPassword });
    if (user) return res.status(200).json(user);
    else return res.status(500).json({ message: 'An error has occured', user });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};
