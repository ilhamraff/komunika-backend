import express from "express";
import verifyToken from "../middlewares/verifyToken";
import * as transactionController from "../controllers/transactionController";

const transactionRoutes = express.Router();

transactionRoutes.post(
  "/transaction",
  verifyToken,
  transactionController.createTransaction
);

export default transactionRoutes;
