import { PrismaClient } from '@prisma/client';
import CustomeError from '../utils/CustomeError';

const prisma = new PrismaClient();

export const updateProfileInfo = async ({
  userId,
  firstName,
  middleName,
  lastName,
}: {
  userId: number;
  firstName: string;
  middleName?: string;
  lastName: string;
}) => {
  const profile = await prisma.profile.upsert({
    where: {
      userId,
    },
    update: {
      firstName,
      middleName,
      lastName,
    },
    create: {
      firstName,
      middleName,
      lastName,
      userId,
    },
  });

  return profile;
};

export const updateProfilePhoto = async ({
  userId,
  profilePhoto,
  profilePublicId,
}: {
  userId: number;
  profilePhoto: string;
  profilePublicId: string;
}) => {
  const hasProfile = await prisma.profile.findUnique({
    where: {
      userId,
    },
  });

  if (!hasProfile)
    throw new CustomeError(403, 'Please add other required fields.');

  const profile = await prisma.profile.update({
    where: {
      userId,
    },
    data: {
      profilePhoto,
      profilePublicId,
    },
  });

  return profile;
};

export const updateCoverPhoto = async ({
  userId,
  coverPhoto,
  coverPublicId,
}: {
  userId: number;
  coverPhoto: string;
  coverPublicId: string;
}) => {
  const hasProfile = await prisma.profile.findUnique({
    where: {
      userId,
    },
  });

  if (!hasProfile)
    throw new CustomeError(403, 'Please add other required fields.');

  const profile = await prisma.profile.update({
    where: {
      userId,
    },
    data: {
      coverPhoto,
      coverPublicId,
    },
  });

  return profile;
};

export const getProfile = async (userId: number) => {
  const profile = await prisma.user.findFirstOrThrow({
    where: {
      id: userId,
    },
    include: {
      profile: true,
    },
  });

  return profile;
};

export const searchUser = async ({
  selfId,
  myCursor,
  filter,
}: {
  selfId: number;
  myCursor?: number;
  filter: string;
}) => {
  const users = await prisma.user.findMany({
    skip: myCursor ? 1 : 0,
    take: 5,
    ...(myCursor && {
      cursor: {
        id: myCursor,
      },
    }),
    where: {
      // NOT: {
      //   id: selfId,
      // },
      OR: [
        {
          email: {
            contains: filter,
          },
        },
        {
          profile: {
            OR: [
              {
                firstName: {
                  contains: filter,
                },
              },
              {
                lastName: {
                  contains: filter,
                },
              },
            ],
          },
        },
      ],
    },
    include: {
      profile: true,
    },
  });

  return users;
};
