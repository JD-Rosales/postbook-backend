import { Request, Response } from 'express';
import { ZodError } from 'zod';
import CustomeError from '../utils/CustomeError';

const errHandler = (error: unknown, res: Response) => {
  if (error instanceof CustomeError)
    return res.status(error.statusCode).json({ message: error.message });
  else if (error instanceof ZodError)
    return res.status(403).json({ message: error.issues[0].message });
  else if (error instanceof Error)
    return res.status(400).json({ message: error.message });
  else
    return res.status(500).json({ message: 'An unexpected error has occured' });
};

export default errHandler;
