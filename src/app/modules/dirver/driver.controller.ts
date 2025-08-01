/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";
import { catchAsync } from "../../utils/catchAsync";
import { verifyToken } from "../../utils/jwt";
import { sendResponse } from "../../utils/sendResponse";
import { DriverService } from "./driver.service";

const registerDriver = catchAsync(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await DriverService.registerDriver(req.user.userId, req.body);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "driver Created Successfully",
      data: user,
    });
  }
);

const updateStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization as string;

    const decodedToken = verifyToken(
      token,
      envVars.JWT_ACCESS_SECRET
    ) as JwtPayload;
    const userId = decodedToken.userId;

    const { isOnline } = req.body;

    const result = await DriverService.updateDriverStatus(userId, isOnline);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Driver status updated",
      data: result,
    });
  }
);

const getDriverRides = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await DriverService.getDriverRides(req.user._id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Driver rides retrieved',
    data: result,
  });
});

const getEarnings = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization as string;

    const decodedToken = verifyToken(
      token,
      envVars.JWT_ACCESS_SECRET
    ) as JwtPayload;

    const userId = decodedToken.userId;

    const result = await DriverService.getDriverEarnings(userId);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Earnings retrieved successfully",
      data: result,
    });
  }
);

const updateLocation = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await DriverService.updateLocation(req.user._id, req.body.location);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Location updated',
    data: result,
  });
});

export const DriverController = {
  registerDriver,
  updateStatus,
  getEarnings,
  updateLocation,
  getDriverRides
};
