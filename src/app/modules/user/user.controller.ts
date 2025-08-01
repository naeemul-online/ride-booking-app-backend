/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { UserService } from "./user.service";

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserService.createUser(req.body);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User Created Successfully",
      data: user,
    });
  }
);

const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const result = await UserService.getAllUsers(
      query as Record<string, string>
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "All users retrieved successfully",
      data: result.data,
      meta: result.meta,
    });
  }
);

const blockUnblockUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    const { status } = req.body;
    const result = await UserService.blockUnblockUser(userId, status);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: `User ${status} successfully`,
      data: result,
    });
  }
);

const approveDriver = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { driverId } = req.params;
    const { approvalStatus } = req.body;
    const result = await UserService.approveDriver(driverId, approvalStatus);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: `Driver ${approvalStatus} successfully`,
      data: result,
    });
  }
);

const getSingleUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserService.getSingleUser(req.user.userId);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User retrieved successfully",
      data: result,
    });
  }
);

const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    const verifiedToken = req.user;
    const payload = req.body;
    const user = await UserService.updateUser(
      userId,
      payload,
      verifiedToken as JwtPayload
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User Updated Successfully",
      data: user,
    });
  }
);

const getAllDrivers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserService.getAllDrivers();
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Drivers retrieved successfully",
      data: result,
    });
  }
);

const getAllRides = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserService.getAllRides();
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Rides retrieved successfully",
      data: result,
    });
  }
);

const getSystemStats = catchAsync(
  async (eq: Request, res: Response, next: NextFunction) => {
    const result = await UserService.getSystemStats();
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "System statistics retrieved",
      data: result,
    });
  }
);

export const UserControllers = {
  createUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  blockUnblockUser,
  getAllDrivers,
  approveDriver,
  getAllRides,
  getSystemStats,
};
