import { Request, Response } from 'express';
import z from 'zod';
import { UserRequest } from '../middlewares/VerifyToken';
import * as PostServices from '../services/PostServices';
import errHandler from '../middlewares/ErrorHandler';
import { cloudinary } from '../config/cloudinary';

export const fetchUserPosts = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const myCursor = req.query.cursor;

    const Schema = z.object({
      userId: z
        .string({
          required_error: 'User ID is required',
          invalid_type_error: 'User ID is not a valid ID',
        })
        .transform((value) => parseInt(value)),
      myCursor: z.string().transform((value) => parseInt(value)),
    });

    const validated = Schema.parse({ userId, myCursor });

    const data = await PostServices.fetchUserPosts(validated);

    return res.status(200).json({ data });
  } catch (error) {
    errHandler(error, res);
  }
};

export const fetchFollowed = async (req: Request, res: Response) => {
  try {
    const selfId = (req as UserRequest).user.id;
    const myCursor = req.query.cursor;

    const Schema = z.object({
      selfId: z.number({
        required_error: 'Self ID is required',
        invalid_type_error: 'Self ID is not a valid ID',
      }),
      myCursor: z.string().transform((value) => parseInt(value)),
    });

    const validated = Schema.parse({ selfId, myCursor });

    const data = await PostServices.fetchFollowedPosts(validated);

    return res.status(200).json({ data });
  } catch (error) {
    errHandler(error, res);
  }
};

export const createPost = async (req: Request, res: Response) => {
  try {
    const { text, photo, photoPublicId } = req.body;
    const authorId = (req as UserRequest).user.id;

    // validate data
    if (!text && !photo) {
      return res.status(422).json({ message: 'Cannot create an empty post' });
    }

    const Schema = z.object({
      text: z
        .string({ invalid_type_error: 'text must be a string' })
        .optional()
        .transform((value) => value?.trim()),
      photo: z
        .string({ invalid_type_error: 'photo must be a string' })
        .optional(),
      photoPublicId: z
        .string({ invalid_type_error: 'photoPublicId must be a string' })
        .optional(),
      authorId: z.number({
        required_error: 'Author ID is required',
        invalid_type_error: 'Author ID is not a valid ID',
      }),
    });

    const validated = Schema.parse({ text, photo, photoPublicId, authorId });

    const post = await PostServices.createPost(validated);

    return res.status(201).json({ data: post });
  } catch (error) {
    errHandler(error, res);
  }
};

export const sharePost = async (req: Request, res: Response) => {
  try {
    const { text, photo, photoPublicId, postId } = req.body;
    const authorId = (req as UserRequest).user.id;

    const Schema = z.object({
      text: z
        .string({ invalid_type_error: 'text must be a string' })
        .optional()
        .transform((value) => value?.trim()),
      photo: z
        .string({ invalid_type_error: 'photo must be a string' })
        .optional()
        .transform((value) => value?.trim()),
      photoPublicId: z
        .string({ invalid_type_error: 'photoPublicId must be a string' })
        .optional()
        .transform((value) => value?.trim()),
      postId: z.number({
        required_error: 'Post ID is required',
        invalid_type_error: 'Post ID is not a valid ID',
      }),
      authorId: z.number({
        required_error: 'Author ID is required',
        invalid_type_error: 'Author ID is not a valid ID',
      }),
    });

    const validated = Schema.parse({
      text,
      photo,
      photoPublicId,
      postId,
      authorId,
    });

    const post = await PostServices.sharePost(validated);

    return res.status(201).json({ data: post });
  } catch (error) {
    errHandler(error, res);
  }
};

export const getPost = async (req: Request, res: Response) => {
  try {
    const postId = parseInt(req.params.id);

    const Schema = z.object({
      postId: z.number({
        required_error: 'Post ID is required',
        invalid_type_error: 'Post ID is not a valid ID',
      }),
    });

    const validated = Schema.parse({ postId });

    const post = await PostServices.getPost(validated.postId);

    return res.status(200).json({ data: post });
  } catch (error) {
    errHandler(error, res);
  }
};

export const updatePost = async (req: Request, res: Response) => {
  try {
    const { text, photo, photoPublicId, postId } = req.body;

    // validate data
    if (!text && !photo) {
      return res.status(422).json({ message: 'Cannot have an empty post' });
    }

    const Schema = z.object({
      postId: z.number({
        required_error: 'Post ID is required',
        invalid_type_error: 'Post ID is not a valid ID',
      }),
      text: z
        .string({ invalid_type_error: 'text must be a string' })
        .optional()
        .transform((value) => value?.trim()),
      photo: z
        .string({ invalid_type_error: 'text must be a string' })
        .optional()
        .transform((value) => value?.trim()),
      photoPublicId: z
        .string({ invalid_type_error: 'photoPublicId must be a string' })
        .optional(),
    });

    const validated = Schema.parse({ text, photo, photoPublicId, postId });

    const prevPost = await PostServices.updatePost(validated);

    // after updating the post in database, delete the post photo in cloudinary
    if (photoPublicId && prevPost.photoPublicId) {
      const img = await cloudinary.uploader.destroy(prevPost.photoPublicId);
    }

    return res.status(200).json({ data: prevPost });
  } catch (error) {
    errHandler(error, res);
  }
};

export const deletePost = async (req: Request, res: Response) => {
  try {
    const postId = req.params.id;
    const authorId = (req as UserRequest).user.id;
    const Schema = z.object({
      postId: z
        .string({
          required_error: 'Post ID is required',
          invalid_type_error: 'Post ID is not a valid ID',
        })
        .transform((value) => parseInt(value)),
      authorId: z.number({
        required_error: 'Author ID is required',
        invalid_type_error: 'Author ID is not a valid ID',
      }),
    });

    const validated = Schema.parse({ postId, authorId });

    const post = await PostServices.deletePost(validated);

    // after deleting the post in database, delete the post photo in cloudinary
    if (post.photoPublicId) {
      const img = await cloudinary.uploader.destroy(post.photoPublicId);
    }

    return res.status(200).json({ data: post });
  } catch (error) {
    errHandler(error, res);
  }
};

export const likePost = async (req: Request, res: Response) => {
  try {
    const { postId } = req.body;
    const userId = (req as UserRequest).user.id;

    const post = await PostServices.updatePostLike({ postId, userId });

    return res.status(201).json({ data: post });
  } catch (error) {
    errHandler(error, res);
  }
};

export const getTotalLikes = async (req: Request, res: Response) => {
  try {
    const postId = req.params.id;
    const userId = (req as UserRequest).user.id;

    const Schema = z.object({
      postId: z
        .string({
          required_error: 'Post ID is required',
          invalid_type_error: 'Post ID is not a valid ID',
        })
        .transform((value) => parseInt(value)),
      userId: z.number({
        required_error: 'User ID is required',
        invalid_type_error: 'User ID is not a valid ID',
      }),
    });

    const validated = Schema.parse({ postId, userId });

    const data = await PostServices.getTotalLikes(validated);

    return res.status(200).json({ data });
  } catch (error) {
    errHandler(error, res);
  }
};
