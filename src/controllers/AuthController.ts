import { Request, Response } from 'express';
import z from 'zod';
import * as AuthServices from '../services/AuthServices';
import { UserRequest } from '../middlewares/VerifyToken';
import generateToken from '../utils/JwtGenerator';
import errHandler from '../middlewares/ErrorHandler';

export const validateToken = async (req: Request, res: Response) => {
  try {
    const user = (req as UserRequest).user;

    return res.status(200).json({ data: user });
  } catch (error) {
    errHandler(error, res);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const Schema = z.object({
      email: z.string({ required_error: 'Email is required' }).email(),
      password: z.string({ required_error: 'Password is required' }),
    });

    const validated = Schema.parse({ email, password });

    const user = await AuthServices.login(validated);

    const token = generateToken(user);

    return res.status(200).json({ data: user, token });
  } catch (error) {
    errHandler(error, res);
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, password_confirmation } = req.body;

    const Schema = z
      .object({
        email: z.string({ required_error: 'Email is required' }).email(),
        password: z
          .string({ required_error: 'Password is required' })
          .min(6, 'Password must contain at least 6 character(s)')
          .transform((value) => value.trim()),
        password_confirmation: z
          .string({
            required_error: 'Password confimation is required',
          })
          .transform((value) => value.trim()),
      })
      .refine((data) => data.password === data.password_confirmation, {
        message: 'Passwords do not match',
        path: ['password_confirmation'],
      });

    const validated = Schema.parse({ email, password, password_confirmation });

    const user = await AuthServices.register(validated);

    return res.status(200).json({ data: user });
  } catch (error) {
    errHandler(error, res);
  }
};
