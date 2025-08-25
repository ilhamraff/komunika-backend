import * as chatRepositories from "../repositories/chatRepositories";

export const createRoomPersonal = async (
  senderId: string,
  receiverId: string
) => {
  return await chatRepositories.createRoomPersonal(senderId, receiverId);
};

export const getRecentRooms = async (userId: string) => {
  return await chatRepositories.getRooms(userId);
};
