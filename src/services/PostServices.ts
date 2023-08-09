import { PrismaClient, Post, Profile } from '@prisma/client';

const prisma = new PrismaClient();

type ReturnPost = Post & {
  author: {
    email: string;
    profile?: Profile;
  };
};

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

export const fetchFollowedPosts = async ({
  selfId,
  myCursor,
}: {
  selfId: number;
  myCursor?: number;
}): Promise<Post[]> => {
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

  const idList = followedUser.following.map((post) => {
    return post.followingId;
  });

  const posts = await prisma.post.findMany({
    skip: myCursor ? 1 : 0,
    take: 2,
    ...(myCursor && {
      cursor: {
        id: myCursor,
      },
    }),
    where: {
      authorId: {
        in: idList,
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

export const fetchUserPosts = async ({
  userId,
  myCursor,
}: {
  userId: number;
  myCursor?: number;
}): Promise<Post[]> => {
  const posts = await prisma.post.findMany({
    skip: myCursor ? 1 : 0,
    take: 2,
    ...(myCursor && {
      cursor: {
        id: myCursor,
      },
    }),
    where: {
      authorId: userId,
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
