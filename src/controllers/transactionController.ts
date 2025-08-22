import { NextFunction, Response } from "express";
import { CustomRequest } from "../types/customRequest";
import { joinFreeGroup } from "../utils/schema/group";
import * as transactionService from "../services/transactionService";

export const createTransaction = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const parse = joinFreeGroup.safeParse(req.body);

    if (!parse.success) {
      const errorMessage = parse.error.issues.map(
        (err) => `${err.path} - ${err.message}`
      );

      return res.status(400).json({
        success: false,
        message: "Validation Error",
        detail: errorMessage,
      });
    }

    const data = await transactionService.createTransaction(
      parse.data.groupId,
      req?.user?.id ?? ""
    );

    return res.json({
      success: true,
      message: "Success create transaction",
      data,
    });
  } catch (error) {
    next(error);
  }
};
