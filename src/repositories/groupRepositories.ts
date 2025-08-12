import { GroupFreeValues } from "../utils/schema/group";
import * as userRepositories from "../repositories/userRepositories";
import prismaClient from "../utils/prisma";

export const createFreeGroup = async (
  data: GroupFreeValues,
  photo: string,
  userId: string
) => {
  const owner = await userRepositories.findRole("OWNER");

  return await prismaClient.group.create({
    data: {
      photo: photo,
      name: data.name,
      about: data.about,
      price: 0,
      type: "FREE",
      room: {
        create: {
          createdBy: userId,
          name: data.name,
          RoomMember: {
            create: {
              userId: userId,
              roleId: owner.id,
            },
          },
          isGroup: true,
        },
      },
    },
  });
};
