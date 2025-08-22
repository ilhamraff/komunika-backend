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
