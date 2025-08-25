import prismaClient from "../utils/prisma";
import * as userRepositories from "../repositories/userRepositories";

export const createRoomPersonal = async (
  senderId: string,
  receiverId: string
) => {
  const room = await prismaClient.room.findFirst({
    where: {
      RoomMember: {
        every: {
          userId: {
            in: [senderId, receiverId],
          },
        },
      },
      isGroup: false,
    },
  });

  const owner = await userRepositories.findRole("OWNER");
  const member = await userRepositories.findRole("MEMBER");

  return await prismaClient.room.upsert({
    where: {
      id: room?.id ?? "0",
    },
    create: {
      createdBy: senderId,
      isGroup: false,
      name: "",
      RoomMember: {
        createMany: {
          data: [
            {
              userId: senderId,
              roleId: owner.id,
            },
            {
              userId: receiverId,
              roleId: member.id,
            },
          ],
        },
      },
    },
    update: {},
  });
};

export const getRooms = async (userId: string) => {
  return await prismaClient.room.findMany({
    where: {
      RoomMember: {
        some: {
          userId: userId,
        },
      },
    },
    include: {
      RoomMessage: {
        select: {
          content: true,
          user: {
            select: {
              name: true,
              photo_url: true,
            },
          },
        },
        take: 1,
        orderBy: {
          createdAt: "desc",
        },
      },
      RoomMember: {
        select: {
          user: {
            select: {
              name: true,
              photo_url: true,
            },
          },
        },
        where: {
          role: {
            role: "MEMBER",
          },
        },
      },
      Group: {
        select: {
          name: true,
          photo_url: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getRoomMessages = async (roomId: string) => {
  return await prismaClient.room.findFirst({
    where: {
      id: roomId,
    },
    select: {
      id: true,
      isGroup: true,
      RoomMessage: {
        select: {
          content: true,
          type: true,
          user: {
            select: {
              id: true,
              name: true,
              photo_url: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      Group: {
        select: {
          name: true,
          photo_url: true,
        },
      },
      RoomMember: {
        select: {
          user: {
            select: {
              id: true,
              name: true,
              photo_url: true,
            },
          },
        },
      },
    },
  });
};
