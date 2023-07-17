import { PrismaClient, User, Profile } from '@prisma/client';

const prisma = new PrismaClient();

export const userDetails = async (id: number): Promise<User | null> => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  return user;
};

export const login = async (
  email: string,
  password: string
): Promise<User | null> => {
  const user = await prisma.user.findFirst({
    where: {
      email,
      password,
    },
  });

  return user;
};

export const checkEmail = async (email: string): Promise<User | null> => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  return user;
};

export const register = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<User | null> => {
  const data = await prisma.user.create({
    data: {
      email,
      password,
    },
  });

  return data;
};

// Add or Update User Details
export const userProfile = async ({
  firstName,
  middleName,
  lastName,
  userId,
}: {
  firstName: string;
  middleName: string;
  lastName: string;
  userId: number;
}): Promise<Profile | null> => {
  const data = await prisma.profile.upsert({
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

  return data;
};
