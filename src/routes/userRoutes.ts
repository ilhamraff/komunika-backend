import express from "express";
import multer from "multer";
import { storageUserPhoto } from "../utils/multer";
import * as userController from "../controllers/userController";

const userRoutes = express.Router();

const uploadPhoto = multer({
  storage: storageUserPhoto,
  fileFilter(req, file, callback) {
    if (file.mimetype.startsWith("image/")) {
      callback(null, true);
    }

    callback(null, false);
  },
});

userRoutes.post(
  "/auth/sign-up",
  uploadPhoto.single("photo"),
  userController.signUp
);

userRoutes.post("/auth/sign-in", userController.signIn);

userRoutes.post("/auth/reset-password", userController.getEmailReset);

userRoutes.put("/auth/reset-password/:tokenId", userController.updatePassword);

export default userRoutes;
