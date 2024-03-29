import { PrismaClient, Post } from '@prisma/client';
import CustomeError from '../utils/CustomeError';

const prisma = new PrismaClient();

export const createPost = async ({
  postType = 'posted',
  photo,
  photoPublicId,
  text,
  authorId,
}: {
  postType?: string;
  photo?: string;
  photoPublicId?: string;
  text?: string;
  authorId: number;
}): Promise<Post> => {
  const post = await prisma.post.create({
    data: {
      postType,
      photo,
      photoPublicId,
      text,
      authorId,
    },
  });

  return post;
};

export const updatePost = async ({
  postId,
  text,
  photo,
  photoPublicId,
}: {
  postId: number;
  text?: string;
  photo?: string;
  photoPublicId?: string;
}) => {
  const prevPost = await prisma.post.findUnique({
    where: {
      id: postId,
    },
  });

  if (!prevPost) throw new CustomeError(404, 'Cannot find post to update');

  await prisma.post.update({
    where: {
      id: postId,
    },
    data: {
      text,
      ...(photo && { photo }),
      ...(photoPublicId && { photoPublicId }),
    },
  });

  // return the prevPost in order for deletion of previous photo in cloudinary if exist
  return prevPost;
};

export const getPost = async (postId: number) => {
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
          id: true,
          email: true,
          profile: true,
        },
      },
      sharedPostId: true,
      sharedPost: {
        select: {
          author: {
            select: {
              id: true,
              email: true,
              profile: {
                select: {
                  profilePhoto: true,
                  firstName: true,
                  middleName: true,
                  lastName: true,
                },
              },
            },
          },
          postType: true,
          createdAt: true,
          text: true,
          photo: true,
        },
      },
      likesCount: true,
    },
  });

  if (!post) throw new CustomeError(404, 'No post found');

  return post;
};

export const deletePost = async ({
  postId,
  authorId,
}: {
  postId: number;
  authorId: number;
}): Promise<Post> => {
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
  });

  if (!post) throw new CustomeError(404, 'Cannot find post');

  if (post.authorId !== authorId)
    throw new CustomeError(401, 'Cannot delete post that is not yours');

  const deletedPost = await prisma.post.delete({
    where: {
      id: post.id,
    },
  });

  return deletedPost;
};

export const sharePost = async ({
  text,
  photo,
  photoPublicId,
  postId,
  authorId,
}: {
  text?: string;
  photo?: string;
  photoPublicId?: string;
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
      photo,
      photoPublicId,
      authorId,
      sharedPostId: originalPost.id,
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
}) => {
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
    take: 5,
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
    },
    orderBy: {
      createdAt: 'desc',
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
}) => {
  const posts = await prisma.post.findMany({
    skip: myCursor ? 1 : 0,
    take: 5,
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
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return posts;
};

export const getTotalLikes = async ({
  postId,
  userId,
}: {
  postId: number;
  userId: number;
}) => {
  const total = await prisma.post.findUnique({
    where: {
      id: postId,
    },
    select: {
      likesCount: true,
    },
  });

  if (!total) throw new CustomeError(404, 'Cannot find post');

  const hasLike = await isPostLiked({ postId, userId });

  return {
    likesCount: total.likesCount,
    userHasLiked: hasLike,
  };
};

export const updatePostLike = async ({
  postId,
  userId,
}: {
  postId: number;
  userId: number;
}) => {
  // get the post to make sure the post exist
  const post = getPost(postId);

  const isLiked = await isPostLiked({ postId, userId });

  if (!isLiked) {
    await prisma.postLike
      .create({
        data: {
          postId,
          userId,
        },
      })
      .then((postLike) => {
        updateLikesCount(postLike.postId, 'increment');
      });
  } else {
    await prisma.postLike
      .delete({
        where: {
          postId_userId: { postId, userId },
        },
      })
      .then((postLike) => {
        updateLikesCount(postLike.postId, 'decrement');
      });
  }

  return post;
};

// --------  ------- //
const isPostLiked = async ({
  postId,
  userId,
}: {
  postId: number;
  userId: number;
}): Promise<boolean> => {
  const isLiked = await prisma.postLike.findUnique({
    where: {
      postId_userId: { postId, userId },
    },
  });

  if (isLiked) return true;
  else return false;
};

const updateLikesCount = async (
  postId: number,
  action: 'increment' | 'decrement'
) => {
  await prisma.post.update({
    where: {
      id: postId,
    },
    data: {
      likesCount: action === 'increment' ? { increment: 1 } : { decrement: 1 },
    },
  });
};
