import express from "express";
import verifyToken, { verifyAdmin } from "../middlewares/verifyToken";
import * as transactionController from "../controllers/transactionController";

const transactionRoutes = express.Router();

transactionRoutes.get(
  "/transaction/:id",
  transactionController.findTransactionById
);

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

transactionRoutes.post(
  "/payouts",
  verifyToken,
  transactionController.createWithdraw
);

transactionRoutes.get(
  "/balance",
  verifyToken,
  transactionController.getBalance
);

transactionRoutes.get(
  "/admin/payouts",
  verifyToken,
  verifyAdmin,
  transactionController.getAllHistoryPayouts
);

export default transactionRoutes;
