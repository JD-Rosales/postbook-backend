import { Request, Response } from 'express';
import { CustomRequest } from '../middlewares/VerifyToken';
import * as PostServices from '../services/PostServices';

export const createPost = async (req: Request, res: Response) => {
  let { text, photo } = req.body;
  try {
    const authorId = (req as CustomRequest).user.id;

    text = text?.trim();
    photo = photo?.trim();

    // validate data
    if (!text && !photo) {
      return res.status(422).json({ message: 'Cannot create an empty post' });
    }

    const post = await PostServices.createPost({ text, photo, authorId });

    return res.status(201).json({ data: post });
  } catch (error) {
    return res.status(500).json({ message: (error as Error).message });
  }
};
