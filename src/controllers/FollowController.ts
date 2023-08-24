import { Request, Response } from 'express';
import { UserRequest } from '../middlewares/VerifyToken';
import * as FollowService from '../services/FollowServices';
import z from 'zod';
import errHandler from '../middlewares/ErrorHandler';

export const followUser = async (req: Request, res: Response) => {
  try {
    const selfId = (req as UserRequest).user.id;
    const { followingId } = req.body;

    const Schema = z
      .object({
        selfId: z.number({ required_error: 'User ID is required' }),
        followingId: z
          .string({
            required_error: 'Followed user ID is required',
            invalid_type_error: 'Followed user ID is not a valid ID',
          })
          .transform((value) => parseInt(value)),
      })
      .refine((data) => data.selfId !== data.followingId, {
        message: 'Are you high? you cannot follow yourself',
        path: ['followingId'],
      });

    const validated = Schema.parse({ selfId, followingId });

    const data = await FollowService.followUser(validated);

    return res.status(200).json({ data });
  } catch (error) {
    errHandler(error, res);
  }
};

export const unfollowUser = async (req: Request, res: Response) => {
  try {
    const selfId = (req as UserRequest).user.id;
    const { followingId } = req.body;

    const Schema = z.object({
      selfId: z.number({ required_error: 'User ID is required' }),
      followingId: z
        .string({
          required_error: 'Followed user ID is required',
          invalid_type_error: 'Followed user ID is not a valid ID',
        })
        .transform((value) => parseInt(value)),
    });

    const validated = Schema.parse({ selfId, followingId });

    const data = await FollowService.unfollowUser(validated);

    return res.status(202).json({ data });
  } catch (error) {
    errHandler(error, res);
  }
};

export const isFollowing = async (req: Request, res: Response) => {
  try {
    const selfId = (req as UserRequest).user.id;
    const followingId = req.params.id;

    const Schema = z.object({
      selfId: z.number({ required_error: 'User ID is required' }),
      followingId: z
        .string({
          required_error: 'Followed user ID is required',
          invalid_type_error: 'Followed user ID is not a valid ID',
        })
        .transform((value) => parseInt(value)),
    });

    const validated = Schema.parse({ selfId, followingId });

    const data = await FollowService.isFollowing(validated);

    return res.status(200).json({ data });
  } catch (error) {
    errHandler(error, res);
  }
};

export const userFollowers = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    const Schema = z.object({
      userId: z
        .string({
          required_error: 'User ID is required',
          invalid_type_error: 'User ID is not a valid ID',
        })
        .transform((value) => parseInt(value)),
    });

    const validated = Schema.parse({ userId });

    const followers = await FollowService.myFollowers(validated.userId);

    return res.status(200).json({ data: followers });
  } catch (error) {
    errHandler(error, res);
  }
};
