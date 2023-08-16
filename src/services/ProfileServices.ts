import { PrismaClient, User, Profile } from '@prisma/client';

const prisma = new PrismaClient();

// Add or Update User Details
export const newProfile = async ({
  firstName,
  middleName,
  lastName,
  profilePhoto,
  coverPhoto,
  userId,
}: {
  firstName: string;
  middleName?: string;
  lastName: string;
  profilePhoto?: string;
  coverPhoto?: string;
  userId: number;
}): Promise<Profile> => {
  const data = await prisma.profile.upsert({
    where: {
      userId,
    },
    update: {
      firstName,
      middleName,
      lastName,
      ...(profilePhoto && { profilePhoto }),
      ...(coverPhoto && { coverPhoto }),
    },
    create: {
      firstName,
      middleName,
      lastName,
      ...(profilePhoto && { profilePhoto }),
      ...(coverPhoto && { coverPhoto }),
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
