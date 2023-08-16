import { PrismaClient, Follow, User } from '@prisma/client';
import CustomeError from '../utils/CustomeError';

const prisma = new PrismaClient();

export const followUser = async ({
  selfId,
  followingId,
}: {
  selfId: number;
  followingId: number;
}): Promise<Follow> => {
  const isFollowed = await isFollowing({ selfId, followingId });

  if (isFollowed) throw new Error(`You're already following this user`);

  const follow = await prisma.follow.create({
    data: {
      followerId: selfId,
      followingId,
    },
  });

  return follow;
};

export const unfollowUser = async ({
  selfId,
  followingId,
}: {
  selfId: number;
  followingId: number;
}): Promise<Follow> => {
  const followData = await prisma.follow.findFirst({
    where: {
      followerId: selfId,
      followingId,
    },
  });

  if (!followData) throw new CustomeError(404, 'Cannot find followed user');

  const res = await prisma.follow.delete({
    where: {
      followerId_followingId: {
        followerId: followData.followerId,
        followingId: followData.followingId,
      },
    },
  });

  return res;
};
export const myFollowers = async (
  userId: number
): Promise<Omit<User, 'password'>[]> => {
  const userFollowers = await prisma.follow.findMany({
    where: {
      followingId: userId,
    },
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      follower: {
        select: {
          id: true,
          email: true,
          profile: true,
        },
      },
    },
  });

  const followers = userFollowers.map((userFollow) => userFollow.follower);
  return followers;
};

export const isFollowing = async ({
  selfId,
  followingId,
}: {
  selfId: number;
  followingId: number;
}): Promise<boolean> => {
  const isFollowing = await prisma.follow.findFirst({
    where: {
      followerId: selfId,
      followingId,
    },
  });

  if (isFollowing) return true;
  else return false;
};
