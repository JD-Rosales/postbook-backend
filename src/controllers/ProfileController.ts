import { Request, Response } from 'express';
import z from 'zod';
import * as ProfileServices from '../services/ProfileServices';
import { userDetails } from '../services/UserServices';
import validate from '../utils/SchemaValidator';
import { CustomRequest } from '../middlewares/VerifyToken';
import { cloudinary } from '../config/cloudinary';

export const newProfile = async (req: Request, res: Response) => {
  let { firstName, middleName, lastName, profilePhoto, coverPhoto } = req.body;
  try {
    const userId = (req as CustomRequest).user.id;

    firstName = firstName?.trim();
    middleName = middleName?.trim();
    lastName = lastName?.trim();

    // validate data
    const inputSchema = z.object({
      firstName: z
        .string({ required_error: 'First name is required' })
        .min(1, 'First name is required'),
      lastName: z
        .string({ required_error: 'Last name is required' })
        .min(1, 'Last name is required'),
      userId: z.number({ required_error: 'User ID is missing' }),
    });

    const validator = validate(inputSchema, {
      firstName,
      lastName,
      userId,
    });

    if (validator?.errors)
      return res.status(400).json({ message: validator.issues[0].message });

    const userDetails = await ProfileServices.newProfile({
      firstName,
      middleName,
      lastName,
      profilePhoto,
      coverPhoto,
      userId,
    });

    return res.status(200).json({ data: userDetails });
  } catch (error) {
    return res.status(500).json({ message: (error as Error).message });
  }
};

export const getUserProfile = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  try {
    if (!id) return res.status(404).json({ message: 'No user profile found!' });

    const profile = await ProfileServices.getProfile(id);

    if (!profile) {
      const user = await userDetails(id);
      return res.status(200).json({ data: user });
    }

    return res.status(200).json({ data: profile });
  } catch (error) {
    return res.status(500).json({ message: (error as Error).message });
  }
};

// test
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
    return res.status(500).json({ message: (error as Error).message });
  }
};
