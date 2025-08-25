import express from "express";
import * as chatController from "../controllers/chatController";
import verifyToken from "../middlewares/verifyToken";

const chatRoutes = express.Router();

chatRoutes.post("/chat/rooms", verifyToken, chatController.creataRoomPersonal);

export default chatRoutes;
