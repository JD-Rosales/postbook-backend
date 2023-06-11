import type { Request, Response, NextFunction } from 'express';
import * as UserServices from '../services/UserServices';

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id: number = parseInt(req.params.id);
  console.log(req.params.id);

  const user = await UserServices.userDetails(id);
  return res.status(200).json(user);
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const test = req.body;
  console.log(test);

  //   const user = UserServices.register(userDetails);
  //   return res.status(200).json(user);
};
