import { Request, Response } from 'express';
import z from 'zod';
import * as ProfileServices from '../services/ProfileServices';
import { UserRequest } from '../middlewares/VerifyToken';
import { cloudinary } from '../config/cloudinary';
import errHandler from '../middlewares/ErrorHandler';

export const newProfile = async (req: Request, res: Response) => {
  try {
    const { firstName, middleName, lastName, profilePhoto, coverPhoto } =
      req.body;
    const userId = (req as UserRequest).user.id;

    const Schema = z.object({
      userId: z.number({ required_error: 'User ID is required' }),
      firstName: z
        .string({ required_error: 'First name is required' })
        .min(1, 'First name is required')
        .transform((value) => value.trim()),
      middleName: z
        .string()
        .transform((value) => value.trim())
        .optional(),
      lastName: z
        .string({ required_error: 'Last name is required' })
        .min(1, 'Last name is required')
        .transform((value) => value.trim()),
      profilePhoto: z.string().optional(),
      coverPhoto: z.string().optional(),
    });

    const validated = Schema.parse({
      userId,
      firstName,
      middleName,
      lastName,
      profilePhoto,
      coverPhoto,
    });

    const userDetails = await ProfileServices.newProfile(validated);

    return res.status(200).json({ data: userDetails });
  } catch (error) {
    return res.status(500).json({ message: (error as Error).message });
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

    const data = await ProfileServices.getProfile(validated.userId);

    return res.status(200).json({ data });
  } catch (error) {
    errHandler(error, res);
  }
};

// test 39965
export const testImageUpload = async (req: Request, res: Response) => {
  try {
    const imgUploader = await cloudinary.uploader.upload(
      'https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg',
      {
        upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
      },
      (err: any, res: any) => {
        console.log('RESPONSE: ', res);
        console.log('ERROR: ', err);
      }
    );

    return res.status(200).json({ data: imgUploader });
  } catch (error) {
    errHandler(error, res);
  }
};
