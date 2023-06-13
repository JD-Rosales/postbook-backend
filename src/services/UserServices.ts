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
    select: {
      id: true,
      email: true,
      password: true,
    },
  });

  return user;
};

export const register = async (
  user: Omit<User, 'id'>
): Promise<Omit<User, 'password'> | null> => {
  const data = await prisma.user.create({
    data: {
      email: user.email,
      password: user.password,
    },
  });

  return data;
};
