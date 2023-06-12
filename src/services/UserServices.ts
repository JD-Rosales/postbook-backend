import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type User = {
  id: number;
  email: string;
  password: string;
};

export const userDetails = async (id: number): Promise<User | null> => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  return user;
};

export const checkEmail = async (email: string): Promise<boolean> => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (user) return true;
  else return false;
};

export const register = async (
  user: Omit<User, 'id'>
): Promise<User | null> => {
  const data = await prisma.user.create({
    data: {
      email: user.email,
      password: user.password,
    },
  });

  return data;
};
