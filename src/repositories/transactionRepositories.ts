import { Prisma } from "@prisma/client";
import prismaClient from "../utils/prisma";

export const createTransaction = async (
  data: Prisma.TransactionCreateInput
) => {
  return await prismaClient.transaction.create({
    data,
  });
};
