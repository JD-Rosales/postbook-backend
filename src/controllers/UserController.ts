import { Request, Response } from 'express';
import z from 'zod';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as UserServices from '../services/UserServices';
import validate from '../utils/SchemaValidator';

export const getUser = async (req: Request, res: Response) => {
  try {
    const id: number = parseInt(req.params.id);

    const user = await UserServices.userDetails(id);

    if (user) return res.status(200).json(user);
    else return res.status(404).json({ message: 'No user found' });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // validate data
    const inputSchema = z.object({
      email: z.string({ required_error: 'Email is required' }).email(),
      password: z
        .string({ required_error: 'Password is required' })
        .min(6, 'Password must contain at least 6 character(s)'),
    });

    const validator = validate(inputSchema, { email, password });

    if (validator?.errors)
      return res.status(400).json({ message: validator.issues[0].message });

    const user = await UserServices.checkEmail(email);

    if (!user) return res.status(404).json({ message: 'Account not found' });

    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = jwt.sign({ id: user?.id }, process.env.SECRET_KEY as string, {
      expiresIn: '1d',
    });
    return res.status(200).json({ token });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // validate data
    const inputSchema = z.object({
      email: z.string({ required_error: 'Email is required' }).email(),
      password: z
        .string({ required_error: 'Password is required' })
        .min(6, 'Password must contain at least 6 character(s)'),
    });

    const validator = validate(inputSchema, { email, password });

    if (validator?.errors)
      return res.status(400).json({ message: validator.issues[0].message });

    // check for duplicate email
    if (await UserServices.checkEmail(email)) {
      return res.status(409).json({ message: 'Email is already registered' });
    }

    // hash the password
    const hashPassword = bcrypt.hashSync(password, 10);

    const user = await UserServices.register({ email, password: hashPassword });
    if (user) return res.status(200).json(user);
    else return res.status(500).json({ message: 'An error has occured' });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};
