import { Request, Response } from 'express';
import z from 'zod';
import * as UserServices from '../services/UserServices';
import { UserRequest } from '../middlewares/VerifyToken';
import { createPost } from '../services/PostServices';
import errHandler from '../middlewares/ErrorHandler';

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { firstName, middleName, lastName } = req.body;
    const userId = (req as UserRequest).user.id;

    const Schema = z.object({
      userId: z.number({ required_error: 'User ID is required.' }),
      firstName: z
        .string({ required_error: 'First name is required.' })
        .min(1, 'First name is required.')
        .transform((value) => value?.trim()),
      middleName: z
        .string()
        .transform((value) => value?.trim())
        .optional(),
      lastName: z
        .string({ required_error: 'Last name is required.' })
        .min(1, 'Last name is required.')
        .transform((value) => value?.trim()),
    });

    const validated = Schema.parse({
      userId,
      firstName,
      middleName,
      lastName,
    });

    const profile = await UserServices.updateProfileInfo(validated);

    return res.status(200).json({ data: profile });
  } catch (error) {
    errHandler(error, res);
  }
};

export const updateProfilePhoto = async (req: Request, res: Response) => {
  try {
    const { profilePhoto, profilePublicId } = req.body;
    const userId = (req as UserRequest).user.id;

    const Schema = z.object({
      userId: z.number({ required_error: 'User ID is required' }),
      profilePhoto: z.string(),
      profilePublicId: z.string(),
    });

    const validated = Schema.parse({
      userId,
      profilePhoto,
      profilePublicId,
    });

    const profile = await UserServices.updateProfilePhoto(validated);
    if (profile.profilePhoto && profilePublicId) {
      await createPost({
        postType: 'updated his/her photo',
        photo: profile.profilePhoto,
        photoPublicId: profile.profilePublicId
          ? profile.profilePublicId
          : undefined,
        authorId: profile.userId,
      });
    }

    return res.status(200).json({ data: profile });
  } catch (error) {
    errHandler(error, res);
  }
};

export const updateCoverPhoto = async (req: Request, res: Response) => {
  try {
    const { coverPhoto, coverPublicId } = req.body;
    const userId = (req as UserRequest).user.id;

    const Schema = z.object({
      userId: z.number({ required_error: 'User ID is required' }),
      coverPhoto: z.string(),
      coverPublicId: z.string(),
    });

    const validated = Schema.parse({
      userId,
      coverPhoto,
      coverPublicId,
    });

    const cover = await UserServices.updateCoverPhoto(validated);
    if (cover.coverPhoto && coverPublicId) {
      await createPost({
        postType: 'updated his/her cover',
        photo: cover.coverPhoto,
        photoPublicId: cover.coverPublicId ? cover.coverPublicId : undefined,
        authorId: cover.userId,
      });
    }

    return res.status(200).json({ data: cover });
  } catch (error) {
    errHandler(error, res);
  }
};

export const getUserProfile = async (req: Request, res: Response) => {
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

    const data = await UserServices.getProfile(validated.userId);

    return res.status(200).json({ data });
  } catch (error) {
    errHandler(error, res);
  }
};

export const searchUser = async (req: Request, res: Response) => {
  try {
    const selfId = (req as UserRequest).user.id;
    const myCursor = req.query.cursor;
    const filter = req.query.filter;

    const Schema = z.object({
      selfId: z.number({
        required_error: 'User ID is required',
        invalid_type_error: 'User ID is not a valid ID',
      }),
      myCursor: z.string().transform((value) => parseInt(value)),
      filter: z.string(),
    });

    const validated = Schema.parse({ selfId, myCursor, filter });

    const data = await UserServices.searchUser(validated);

    return res.status(200).json({ data });
  } catch (error) {
    errHandler(error, res);
  }
};
