import { Request, Response } from 'express';
import { UserRequest } from '../middlewares/VerifyToken';
import * as FollowService from '../services/FollowServices';
import z from 'zod';
import validate from '../utils/SchemaValidator';

export const followUser = async (req: Request, res: Response) => {
  try {
    const followerId = (req as UserRequest).user.id;
    const { followingId } = req.body;

    // validate data
    const inputSchema = z
      .object({
        followerId: z.number({ required_error: 'Follower ID is required' }),
        followingId: z.number({ required_error: 'Following ID is required' }),
      })
      .refine((data) => data.followerId !== data.followingId, {
        message: 'Are you high? you cannot follow yourself',
        path: ['followingId'],
      });

    const validator = validate(inputSchema, { followerId, followingId });

    if (validator?.errors)
      return res.status(400).json({ message: validator.issues[0].message });

    const data = await FollowService.followUser({ followerId, followingId });

    return res.status(200).json({ data });
  } catch (error) {
    return res.status(500).json({ message: (error as Error).message });
  }
};

export const unfollowUser = async (req: Request, res: Response) => {
  try {
    const followerId = (req as UserRequest).user.id;
    const { followingId } = req.body;

    // validate data
    const inputSchema = z.object({
      followerId: z.number({ required_error: 'Follower ID is required' }),
      followingId: z.number({ required_error: 'Following ID is required' }),
    });

    const validator = validate(inputSchema, { followerId, followingId });

    if (validator?.errors)
      return res.status(400).json({ message: validator.issues[0].message });

    const data = await FollowService.unfollowUser({
      followerId,
      followingId,
    });

    return res.status(202).json({ data });
  } catch (error) {
    return res.status(500).json({ message: (error as Error).message });
  }
};

export const isFollowing = async (req: Request, res: Response) => {
  try {
    const followerId = (req as UserRequest).user.id;
    const followingId = parseInt(req.params.id);

    // validate data
    const inputSchema = z.object({
      followerId: z.number({ required_error: 'Follower ID is required' }),
      followingId: z.number({ required_error: 'Following ID is required' }),
    });

    const validator = validate(inputSchema, { followerId, followingId });

    if (validator?.errors)
      return res.status(400).json({ message: validator.issues[0].message });

    const data = await FollowService.isFollowing({
      followerId,
      followingId,
    });

    return res.status(200).json({ data });
  } catch (error) {
    return res.status(500).json({ message: (error as Error).message });
  }
};

export const userFollowers = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id);

    // validate data
    const inputSchema = z.object({
      userId: z.number({ required_error: 'User ID is required' }),
    });

    const validator = validate(inputSchema, { userId });

    if (validator?.errors)
      return res.status(400).json({ message: validator.issues[0].message });

    const followers = await FollowService.myFollowers(userId);

    return res.status(200).json({ data: followers });
  } catch (error) {
    return res.status(500).json({ message: (error as Error).message });
  }
};
