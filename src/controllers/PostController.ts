import { Request, Response } from 'express';
import z from 'zod';
import validate from '../utils/SchemaValidator';
import { UserRequest } from '../middlewares/VerifyToken';
import * as PostServices from '../services/PostServices';

export const fetchUserPosts = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id);
    const cursor = Number(req.query.cursor);

    if (!userId) throw new Error('Cannot find user posts');

    const data = await PostServices.fetchUserPosts({
      userId,
      myCursor: cursor,
    });

    return res.status(200).json({ data });
  } catch (error) {
    return res.status(500).json({ message: (error as Error).message });
  }
};

export const fetchFollowed = async (req: Request, res: Response) => {
  try {
    const selfId = (req as UserRequest).user.id;
    const cursor = Number(req.query.cursor);

    const data = await PostServices.fetchFollowedPosts({
      selfId,
      myCursor: cursor,
    });

    return res.status(200).json({ data });
  } catch (error) {
    return res.status(500).json({ message: (error as Error).message });
  }
};

export const createPost = async (req: Request, res: Response) => {
  try {
    let { text, photo } = req.body;
    const authorId = (req as UserRequest).user.id;
    const postType = 'posted';

    text = text?.trim();
    photo = photo?.trim();

    // validate data
    if (!text && !photo) {
      return res.status(422).json({ message: 'Cannot create an empty post' });
    }

    const post = await PostServices.createPost({
      postType,
      text,
      photo,
      authorId,
    });

    return res.status(201).json({ data: post });
  } catch (error) {
    return res.status(500).json({ message: (error as Error).message });
  }
};

export const sharePost = async (req: Request, res: Response) => {
  try {
    let { text, postId } = req.body;
    const authorId = (req as UserRequest).user.id;

    text = text?.trim();

    // validate data
    const inputSchema = z.object({
      postId: z.number({ required_error: 'First name is required' }),
    });

    const validator = validate(inputSchema, { postId });

    if (validator?.errors)
      return res.status(400).json({ message: validator.issues[0].message });

    // const post = await PostServices.sharePost({ text, postId, authorId });

    // return res.status(201).json({ data: post });
  } catch (error) {
    return res.status(500).json({ message: (error as Error).message });
  }
};
