import { GroupFreeValues, GroupPaidValues } from "../utils/schema/group";
import * as userRepositories from "../repositories/userRepositories";
import prismaClient from "../utils/prisma";

export const findGroupById = async (id: string) => {
  return await prismaClient.group.findFirstOrThrow({
    where: {
      id,
    },
    include: {
      room: {
        select: {
          RoomMember: {
            include: {
              role: true,
            },
            where: {
              role: {
                role: "OWNER",
              },
            },
          },
        },
      },
    },
  });
};

export const getDiscoverGroups = async (name = "") => {
  return await prismaClient.group.findMany({
    where: {
      name: {
        contains: name,
        mode: "insensitive",
      },
    },
    select: {
      photo_url: true,
      id: true,
      name: true,
      about: true,
      type: true,
      room: {
        select: {
          _count: {
            select: {
              RoomMember: true,
            },
          },
        },
      },
    },
  });
};

export const getDiscoverPeoples = async (name = "", userId?: string) => {
  return await prismaClient.user.findMany({
    where: {
      id: {
        not: userId,
      },
      name: {
        contains: name,
        mode: "insensitive",
      },
    },
    select: {
      id: true,
      name: true,
      photo_url: true,
      createdAt: true,
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
      id: groupId ?? "",
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
      photo: photo,
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

export const findDetailGroup = async (id: string, userId?: string) => {
  return await prismaClient.group.findFirstOrThrow({
    where: {
      id: id,
      ...(userId !== undefined
        ? {
            room: {
              createdBy: userId,
            },
          }
        : {}),
    },
    select: {
      id: true,
      name: true,
      photo_url: true,
      about: true,
      type: true,
      GroupAsset: {
        select: {
          filename: true,
          id: true,
          ...(userId !== undefined ? { file_url: true } : {}),
        },
      },
      price: true,
      benefit: true,
      room: {
        select: {
          RoomMember: {
            ...(userId === undefined
              ? {
                  take: 1,
                  where: {
                    role: {
                      role: "OWNER",
                    },
                  },
                }
              : {}),
            select: {
              user: {
                select: {
                  name: true,
                  photo_url: true,
                },
              },
              joinedAt: true,
              role: {
                select: {
                  role: true,
                },
              },
            },
          },
          _count: {
            select: {
              RoomMember: true,
            },
          },
        },
      },
    },
  });
};

export const getMyOwnGroups = async (userId: string) => {
  return await prismaClient.group.findMany({
    where: {
      room: {
        createdBy: userId,
      },
    },
    select: {
      id: true,
      photo_url: true,
      name: true,
      type: true,
      room: {
        select: {
          _count: {
            select: {
              RoomMember: true,
            },
          },
          id: true,
        },
      },
    },
  });
};

export const getTotalMembers = async (roomIds: string[]) => {
  return await prismaClient.roomMember.count({
    where: {
      roomId: {
        in: roomIds,
      },
    },
  });
};

export const getMemberById = async (userId: string, groupId: string) => {
  return await prismaClient.roomMember.findFirst({
    where: {
      userId: userId,
      room: {
        Group: {
          id: groupId,
        },
      },
    },
  });
};

export const addMemberToGroup = async (roomId: string, userId: string) => {
  const role = await userRepositories.findRole("MEMBER");

  return await prismaClient.roomMember.create({
    data: {
      roomId: roomId,
      userId: userId,
      roleId: role.id,
    },
  });
};

export const findAssetGroup = async (assetId: string) => {
  return await prismaClient.groupAsset.findFirstOrThrow({
    where: {
      id: assetId,
    },
  });
};

export const deleteAssetGroup = async (assetId: string) => {
  return await prismaClient.groupAsset.delete({
    where: {
      id: assetId,
    },
  });
};
