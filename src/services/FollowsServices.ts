import { PrismaClient, Follows } from '@prisma/client';

const prisma = new PrismaClient();

export const followUser = async ({
  followerId,
  followingId,
}: {
  followerId: number;
  followingId: number;
}): Promise<Follows> => {
  const isFollowed = await prisma.follows.findFirst({
    where: {
      followerId,
      followingId,
    },
  });

  if (isFollowed) throw new Error(`You're already following this user`);

  const follows = await prisma.follows.create({
    data: {
      followerId,
      followingId,
    },
  });

  return follows;
};

export const unfollowUser = async ({
  followerId,
  followingId,
}: {
  followerId: number;
  followingId: number;
}): Promise<Follows> => {
  const followsData = await prisma.follows.findFirst({
    where: {
      followerId,
      followingId,
    },
  });

  if (!followsData) throw new Error('Cannot find followed user');

  const res = await prisma.follows.delete({
    where: {
      followerId_followingId: followsData,
    },
  });

  return res;
};
