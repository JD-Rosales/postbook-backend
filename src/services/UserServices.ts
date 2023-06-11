import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

type User = {
  id: number;
  email: string;
};

export const userDetails = async (id: number): Promise<User | null> => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  return user;
};

export const register = async (
  user: Omit<User, 'id'>
): Promise<User | null> => {
  const data = await prisma.user.create({
    data: {
      email: user.email,
    },
  });

  return data;
};
