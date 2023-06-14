import { PrismaClient, User } from '@prisma/client';

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
