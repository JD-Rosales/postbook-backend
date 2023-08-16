import { PrismaClient, Post, Profile } from '@prisma/client';
import CustomeError from '../utils/CustomeError';

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
      postType: 'posted',
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
  const followedUser = await prisma.user.findFirst({
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

  if (!followedUser) throw new CustomeError(404, 'User not found');

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
      sharedPost: {
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
      },
      sharedPostId: true,
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
      sharedPost: {
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
      },
      sharedPostId: true,
    },
    orderBy: {
      updatedAt: 'desc',
    },
  });

  return posts;
};

export const sharedPost = async ({
  text,
  postId,
  authorId,
}: {
  text?: string;
  postId: number;
  authorId: number;
}): Promise<Post> => {
  const originalPost = await prisma.post.findUnique({
    where: {
      id: postId,
    },
  });

  if (!originalPost) {
    throw new CustomeError(404, 'Original post not found');
  }

  const post = await prisma.post.create({
    data: {
      postType: 'shared a post',
      text,
      authorId,
      sharedPostId: originalPost.id,
    },
  });

  return post;
};

export const getPost = async (postId: number): Promise<Post> => {
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
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
      sharedPostId: true,
    },
  });

  if (!post) throw new CustomeError(404, 'No post found');

  return post;
};

export const deletePost = async (postId: number): Promise<Post> => {
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
  });

  if (!post) throw new CustomeError(404, 'Cannot find post');

  const deletedPost = await prisma.post.delete({
    where: {
      id: post.id,
    },
  });

  return deletedPost;
};
