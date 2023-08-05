import { Request, Response } from 'express';
import { UserRequest } from '../middlewares/VerifyToken';
import * as PostServices from '../services/PostServices';

export const fetchFollowed = async (req: Request, res: Response) => {
  try {
    const selfId = (req as UserRequest).user.id;
    const cursor = Number(req.query.cursor);

    const data = await PostServices.fetchFollowed({ selfId, myCursor: cursor });

    return res.status(200).json({ data });
  } catch (error) {
    return res.status(500).json({ message: (error as Error).message });
  }
};

export const createPost = async (req: Request, res: Response) => {
  let { text, photo } = req.body;
  try {
    const authorId = (req as UserRequest).user.id;

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
