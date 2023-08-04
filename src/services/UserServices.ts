import { PrismaClient, User, Profile } from '@prisma/client';

const prisma = new PrismaClient();

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
}): Promise<User> => {
  const isRegistered = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (isRegistered) throw new Error('Email is already registered');

  const data = await prisma.user.create({
    data: {
      email,
      password,
    },
  });

  return data;
};

export const userDetails = async (
  id: number
): Promise<Omit<User, 'password'> | null> => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (user) {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  return null;
};
