import { Prisma, TransactionType } from "@prisma/client";
import prismaClient from "../utils/prisma";

export const createTransaction = async (
  data: Prisma.TransactionCreateInput
) => {
  return await prismaClient.transaction.create({
    data,
  });
};

export const updateTransaction = async (id: string, type: TransactionType) => {
  return await prismaClient.transaction.update({
    where: {
      id,
    },
    data: {
      type,
    },
  });
};

export const getMyTransactions = async (userId: string) => {
  return await prismaClient.transaction.findMany({
    where: {
      ownerId: userId,
    },
    include: {
      User: {
        select: {
          name: true,
          photo_url: true,
        },
      },
      group: {
        select: {
          name: true,
          photo_url: true,
        },
      },
    },
  });
};

export const getMyPayouts = async (userId: string) => {
  return await prismaClient.payout.findMany({
    where: {
      userId,
    },
  });
};
