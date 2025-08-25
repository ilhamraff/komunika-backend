import * as chatRepositories from "../repositories/chatRepositories";
import { CreateMessageValues } from "../utils/schema/chat";
import path from "node:path";
import fs from "node:fs";

export const createRoomPersonal = async (
  senderId: string,
  receiverId: string
) => {
  return await chatRepositories.createRoomPersonal(senderId, receiverId);
};

export const getRecentRooms = async (userId: string) => {
  return await chatRepositories.getRooms(userId);
};

export const getRoomMessages = async (roomId: string) => {
  return await chatRepositories.getRoomMessages(roomId);
};

export const createMessage = async (
  data: CreateMessageValues,
  userId: string,
  file: Express.Multer.File | undefined
) => {
  const room = await chatRepositories.findRoomById(data.roomId);

  if (!room.isGroup) {
    const member = await chatRepositories.findMember(userId, room.id);

    if (!member) {
      const pathFile = path.join(
        __dirname,
        "../../public/assets/uploads/attach_messages/",
        file?.filename ?? ""
      );

      if (fs.existsSync(pathFile)) fs.unlinkSync(pathFile);

      throw new Error("You are not a member of this group");
    }
  }

  return await chatRepositories.createMessage(data, userId, file);
};
