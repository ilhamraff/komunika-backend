import { RoleType } from "@prisma/client";
import prismaClient from "../utils/prisma";
import { SignUpValues } from "../utils/schema/user";
import crypto from "node:crypto";

export const isEmailExist = async (email: string) => {
  return await prismaClient.user.count({
    where: {
      email: email,
    },
  });
};

export const findRole = async (role: RoleType) => {
  return await prismaClient.role.findFirstOrThrow({
    where: {
      role: role,
    },
  });
};

export const createUser = async (data: SignUpValues, photo: string) => {
  const role = await findRole("USER");

  return await prismaClient.user.create({
    data: {
      email: data.email,
      password: data.password,
      name: data.name,
      roleId: role.id,
      photo,
    },
  });
};

export const findUserByEmail = async (email: string) => {
  return await prismaClient.user.findFirstOrThrow({
    where: {
      email: email,
    },
  });
};

export const createPasswordReset = async (email: string) => {
  const user = await findUserByEmail(email);

  const token = crypto.randomBytes(32).toString("hex");

  return await prismaClient.passwordReset.create({
    data: {
      userId: user.id,
      token,
    },
  });
};
