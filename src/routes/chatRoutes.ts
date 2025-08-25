import express from "express";
import * as chatController from "../controllers/chatController";
import verifyToken from "../middlewares/verifyToken";

const chatRoutes = express.Router();

chatRoutes.get("/chat/rooms", verifyToken, chatController.getRooms);

chatRoutes.get(
  "/chat/rooms/:roomId",
  verifyToken,
  chatController.getRoomsMessages
);

chatRoutes.post("/chat/rooms", verifyToken, chatController.creataRoomPersonal);

export default chatRoutes;
