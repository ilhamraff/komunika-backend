import { NextFunction, Request, Response } from "express";
import { CustomRequest } from "../types/customRequest";
import { groupFreeSchema, groupPaidSchema } from "../utils/schema/group";
import * as groupService from "../services/groupService";
import { date, success } from "zod";

export const getDiscoverGroups = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name } = req.query;

    const data = await groupService.getDiscoverGroups((name as string) ?? "");

    return res.json({
      success: true,
      message: "Get discover group success",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getDiscoverPeoples = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name } = req.query;

    const data = await groupService.getDiscoverPeoples(
      (name as string) ?? "",
      req?.user?.id
    );

    return res.json({
      success: true,
      message: "Get discover peoples success",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const createFreeGroup = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const parse = groupFreeSchema.safeParse(req.body);

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

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "File photo is required",
      });
    }

    const group = await groupService.upsertFreeGroup(
      parse.data,
      req?.user?.id ?? "",
      req.file.filename
    );

    return res.json({
      success: true,
      message: "Create group success",
      data: group,
    });
  } catch (error) {
    next(error);
  }
};

export const updateFreeGroup = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { groupId } = req.params;

    const parse = groupFreeSchema.safeParse(req.body);

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

    const group = await groupService.upsertFreeGroup(
      parse.data,
      req?.user?.id ?? "",
      req?.file?.filename,
      groupId
    );

    return res.json({
      success: true,
      message: "Update group success",
      data: group,
    });
  } catch (error) {
    next(error);
  }
};

export const createPaidGroup = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const parse = groupPaidSchema.safeParse(req.body);

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

    const file = req.files as {
      photo?: Express.Multer.File[];
      assets?: Express.Multer.File[];
    };

    if (!file.photo) {
      return res.status(400).json({
        success: false,
        message: "File photo is required",
      });
    }

    if (!file.assets) {
      return res.status(400).json({
        success: false,
        message: "File asset is required",
      });
    }

    const assets = file.assets.map((file) => file.filename);

    const group = await groupService.upsertPaidGroup(
      parse.data,
      req?.user?.id ?? "",
      file.photo[0].filename,
      assets
    );

    return res.json({
      success: true,
      message: "Create group success",
      data: group,
    });
  } catch (error) {
    next(error);
  }
};

export const updatePaidGroup = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { groupId } = req.params;

    const parse = groupPaidSchema.safeParse(req.body);

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

    const file = req.files as {
      photo?: Express.Multer.File[];
      assets?: Express.Multer.File[];
    };

    const assets = file?.assets?.map((file) => file.filename);

    const group = await groupService.upsertPaidGroup(
      parse.data,
      req?.user?.id ?? "",
      file?.photo?.[0].filename,
      assets,
      groupId
    );

    return res.json({
      success: true,
      message: "Update group success",
      data: group,
    });
  } catch (error) {
    next(error);
  }
};
