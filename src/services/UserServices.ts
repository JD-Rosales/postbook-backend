import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const searchUser = async ({
  selfId,
  filter,
}: {
  selfId: number;
  filter: string;
}) => {
  const users = await prisma.user.findMany({
    where: {
      // NOT: {
      //   id: selfId,
      // },
      OR: [
        {
          email: {
            contains: filter,
          },
        },
        {
          profile: {
            OR: [
              {
                firstName: {
                  contains: filter,
                },
              },
              {
                lastName: {
                  contains: filter,
                },
              },
            ],
          },
        },
      ],
    },
    include: {
      profile: true,
    },
  });

  return users;
};
