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
