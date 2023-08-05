import { PrismaClient, User } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export const login = async (
  email: string,
  password: string
): Promise<Omit<User, 'password'>> => {
  const user = await prisma.user.findFirstOrThrow({
    where: {
      email,
    },
  });

  const passwordMatch = await bcrypt.compareSync(password, user.password);
  if (!passwordMatch) throw new Error('Invalid email or password');

  const parseUser = {
    id: user.id,
    email: user.email,
  };

  return parseUser;
};

export const register = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<Omit<User, 'password'>> => {
  const isRegistered = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (isRegistered) throw new Error('Email is already registered');

  // hash the password
  const hashPassword = bcrypt.hashSync(password, 10);

  const data = await prisma.user.create({
    data: {
      email,
      password: hashPassword,
    },
    select: {
      id: true,
      email: true,
    },
  });

  return data;
};

export const getUser = async (
  userId: number
): Promise<Omit<User, 'password'>> => {
  const profile = await prisma.user.findFirstOrThrow({
    where: {
      id: userId,
    },
    select: {
      id: true,
      email: true,
    },
  });

  return profile;
};
