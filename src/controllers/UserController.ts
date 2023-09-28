import { Request, Response } from 'express';
import z from 'zod';
import * as UserServices from '../services/UserServices';
import { UserRequest } from '../middlewares/VerifyToken';
import errHandler from '../middlewares/ErrorHandler';

export const searchUser = async (req: Request, res: Response) => {
  try {
    const selfId = (req as UserRequest).user.id;
    const filter = req.query.filter;

    console.log(selfId);

    const Schema = z.object({
      selfId: z.number({
        required_error: 'User ID is required',
        invalid_type_error: 'User ID is not a valid ID',
      }),
      filter: z.string(),
    });

    const validated = Schema.parse({ selfId, filter });

    const data = await UserServices.searchUser(validated);

    return res.status(200).json({ data });
  } catch (error) {
    errHandler(error, res);
  }
};
