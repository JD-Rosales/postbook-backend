import { PrismaClient, Post } from '@prisma/client';

const prisma = new PrismaClient();

export const createPost = async ({
  photo,
  text,
  authorId,
}: {
  photo?: string;
  text?: string;
  authorId: number;
}): Promise<Post> => {
  const post = await prisma.post.create({
    data: {
      photo,
      text,
      authorId,
    },
  });

  return post;
};

export const fetchFollowed = async ({
  selfId,
  myCursor,
}: {
  selfId: number;
  myCursor?: number;
}) => {
  const followedUser = await prisma.user.findFirstOrThrow({
    where: {
      id: selfId,
    },
    select: {
      following: {
        select: {
          followingId: true,
        },
      },
    },
  });

  const idLists = followedUser.following.map((post) => {
    return post.followingId;
  });

  const posts = await prisma.post.findMany({
    skip: myCursor ? 1 : 0,
    take: 3,
    ...(myCursor && {
      cursor: {
        id: myCursor,
      },
    }),
    where: {
      authorId: {
        in: idLists,
      },
    },
    orderBy: {
      updatedAt: 'desc',
    },
  });

  return posts;
};