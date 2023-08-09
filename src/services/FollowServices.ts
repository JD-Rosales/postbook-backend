import { PrismaClient, Follow, User } from '@prisma/client';

const prisma = new PrismaClient();

export const followUser = async ({
  followerId,
  followingId,
}: {
  followerId: number;
  followingId: number;
}): Promise<Follow> => {
  const isFollowed = await isFollowing({ followerId, followingId });

  if (isFollowed) throw new Error(`You're already following this user`);

  const follow = await prisma.follow.create({
    data: {
      followerId,
      followingId,
    },
  });

  return follow;
};

export const unfollowUser = async ({
  followerId,
  followingId,
}: {
  followerId: number;
  followingId: number;
}): Promise<Follow> => {
  const followData = await prisma.follow.findFirst({
    where: {
      followerId,
      followingId,
    },
  });

  if (!followData) throw new Error('Cannot find followed user');

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
  const userFollowers = await prisma.user.findFirstOrThrow({
    where: {
      id: userId,
    },
    select: {
      followers: {
        select: {
          followerId: true,
        },
      },
    },
  });

  const idList = userFollowers.followers.map((user) => user.followerId);

  const followers = await prisma.user.findMany({
    where: {
      id: {
        in: idList,
      },
    },
    select: {
      id: true,
      email: true,
      profile: true,
    },
  });

  return followers;
};

export const isFollowing = async ({
  followerId,
  followingId,
}: {
  followerId: number;
  followingId: number;
}): Promise<boolean> => {
  const isFollowing = await prisma.follow.findFirst({
    where: {
      followerId,
      followingId,
    },
  });

  if (isFollowing) return true;
  else return false;
};
