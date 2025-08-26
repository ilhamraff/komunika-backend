import express from "express";
import verifyToken from "../middlewares/verifyToken";
import * as transactionController from "../controllers/transactionController";

const transactionRoutes = express.Router();

transactionRoutes.post(
  "/transaction",
  verifyToken,
  transactionController.createTransaction
);

transactionRoutes.post(
  "/transaction/handle-payment",
  transactionController.updateTransaction
);

transactionRoutes.get(
  "/revenue",
  verifyToken,
  transactionController.getRevenueStat
);

transactionRoutes.get(
  "/payouts",
  verifyToken,
  transactionController.getHistoryPayouts
);

export default transactionRoutes;
