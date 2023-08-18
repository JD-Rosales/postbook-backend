import { PrismaClient, User, Profile } from '@prisma/client';

const prisma = new PrismaClient();

// Add or Update User Details
export const newProfile = async ({
  firstName,
  middleName,
  lastName,
  profilePhoto,
  profilePublicId,
  coverPhoto,
  coverPublicId,
  userId,
}: {
  firstName: string;
  middleName?: string;
  lastName: string;
  profilePhoto?: string;
  profilePublicId?: string;
  coverPhoto?: string;
  coverPublicId?: string;
  userId: number;
}) => {
  const data = await prisma.profile.upsert({
    where: {
      userId,
    },
    update: {
      firstName,
      middleName,
      lastName,
      ...(profilePhoto && { profilePhoto }),
      ...(profilePublicId && { profilePublicId }),
      ...(coverPhoto && { coverPhoto }),
      ...(coverPublicId && { coverPublicId }),
    },
    create: {
      firstName,
      middleName,
      lastName,
      ...(profilePhoto && { profilePhoto }),
      ...(profilePublicId && { profilePublicId }),
      ...(coverPhoto && { coverPhoto }),
      ...(coverPublicId && { coverPublicId }),
      userId,
    },
  });

  return data;
};

export const getProfile = async (
  userId: number
): Promise<Omit<User, 'password'> & { profile: Profile | null }> => {
  const profile = await prisma.user.findFirstOrThrow({
    where: {
      id: userId,
    },
    select: {
      id: true,
      email: true,
      profile: true,
    },
  });

  return profile;
};
