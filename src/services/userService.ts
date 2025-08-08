import { signInSchema, SignUpValues } from "../utils/schema/user";
import * as userRepositories from "../repositories/userRepositories";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mailtrap from "../utils/mailtrap";

export const signUp = async (data: SignUpValues, file: Express.Multer.File) => {
  const isEmailExist = await userRepositories.isEmailExist(data.email);

  if (isEmailExist > 1) {
    throw new Error("Email already taken");
  }

  const user = await userRepositories.createUser(
    {
      ...data,
      password: bcrypt.hashSync(data.password, 12),
    },
    file.fieldname
  );

  const token = jwt.sign({ id: user.id }, process.env.SECRET_AUTH ?? "", {
    expiresIn: "1 days",
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    photo: user.photo_url,
    token,
  };
};

export const signIn = async (data: signInSchema) => {
  const isEmailExist = await userRepositories.isEmailExist(data.email);

  if (isEmailExist === 0) {
    throw new Error("Email not registered");
  }

  const user = await userRepositories.findUserByEmail(data.email);

  if (!bcrypt.compareSync(data.password, user.password)) {
    throw new Error("Email and Password Incorrect");
  }

  const token = jwt.sign({ id: user.id }, process.env.SECRET_AUTH ?? "", {
    expiresIn: "1 days",
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    photo: user.photo_url,
    token,
  };
};

export const getEmailReset = async (email: string) => {
  const data = await userRepositories.createPasswordReset(email);

  await mailtrap.testing.send({
    from: {
      email: "komunika@test.com",
      name: "komunika",
    },
    to: [{ email: email }],
    subject: "Reset Password",
    text: `Berikut Link Reset Password ${data.token}`, // link ke halama frontend
  });

  return true;
};
