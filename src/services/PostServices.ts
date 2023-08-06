import { PrismaClient, Post } from '@prisma/client';

const prisma = new PrismaClient();

export const createPost = async ({
  postType,
  photo,
  text,
  authorId,
}: {
  postType: string;
  photo?: string;
  text?: string;
  authorId: number;
}): Promise<Post> => {
  const post = await prisma.post.create({
    data: {
      postType,
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
    select: {
      id: true,
      postType: true,
      text: true,
      photo: true,
      createdAt: true,
      updatedAt: true,
      authorId: true,
      author: {
        select: {
          email: true,
          profile: true,
        },
      },
    },
    orderBy: {
      updatedAt: 'desc',
    },
  });

  return posts;
};
