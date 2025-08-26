import { Prisma, TransactionType } from "@prisma/client";
import prismaClient from "../utils/prisma";
import { WithdrawValues } from "../utils/schema/transaction";

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
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const createWithdraw = async (data: WithdrawValues, userId: string) => {
  return await prismaClient.payout.create({
    data: {
      amount: data.amount,
      bankName: data.bankName,
      bankAccountName: data.bankAccountName,
      bankAccountNumber: data.bankAccountNumber.toString(),
      userId: userId,
      status: "PENDING",
    },
  });
};
