import { GroupFreeValues, GroupPaidValues } from "../utils/schema/group";
import * as userRepositories from "../repositories/userRepositories";
import prismaClient from "../utils/prisma";

export const findGroupById = async (id: string) => {
  return await prismaClient.group.findFirstOrThrow({
    where: {
      id,
    },
  });
};

export const upsertFreeGroup = async (
  data: GroupFreeValues,
  userId: string,
  photo?: string,
  groupId?: string
) => {
  const owner = await userRepositories.findRole("OWNER");

  return await prismaClient.group.upsert({
    where: {
      id: groupId ?? "",
    },
    create: {
      photo: photo ?? "",
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
    update: {
      photo: photo,
      name: data.name,
      about: data.about,
    },
  });
};

export const upsertPaidGroup = async (
  data: GroupPaidValues,
  userId: string,
  photo?: string,
  assets?: string[],
  groupId?: string
) => {
  const owner = await userRepositories.findRole("OWNER");

  const group = await prismaClient.group.upsert({
    where: {
      id: groupId,
    },
    create: {
      photo: photo ?? "",
      name: data.name,
      about: data.about,
      price: Number.parseInt(data.price),
      benefit: data.benefit,
      type: "PAID",
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
    update: {
      photo: photo ?? "",
      name: data.name,
      about: data.about,
      price: Number.parseInt(data.price),
      benefit: data.benefit,
      type: "PAID",
    },
  });

  if (assets) {
    for (const asset of assets) {
      await prismaClient.groupAsset.create({
        data: {
          filename: asset,
          groupId: group.id,
        },
      });
    }
  }

  return group;
};
