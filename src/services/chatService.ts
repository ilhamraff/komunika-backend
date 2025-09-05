import * as chatRepositories from "../repositories/chatRepositories";
import { CreateMessageValues } from "../utils/schema/chat";
import path from "node:path";
import fs from "node:fs";
import pusher from "../utils/pusher";

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

  const channelName = `chat-room-${data.roomId}`;
  const eventName = `chat-room-${data.roomId}-event`;

  pusher.trigger(channelName, eventName, {
    content: file
      ? `${process.env.URL_ASSET_ATTACH}/${file.filename}`
      : data.message,
    content_url: file
      ? `${process.env.URL_ASSET_ATTACH}/${file.filename}`
      : null,
    user: {
      id: member.user.id,
      name: member.user.name,
      photo_url: member.user.photo_url,
    },
    type: file ? "IMAGE" : "TEXT",
    createdAt: new Date(),
  });

  return await chatRepositories.createMessage(data, userId, file);
};
