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
