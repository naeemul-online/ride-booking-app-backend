/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { RideService } from "./ride.service";
import { verifyToken } from "../../utils/jwt";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";
import { any } from "zod";
import { IUser } from "../user/user.interface";

const requestRide = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization as string;

    const decodedToken = verifyToken(
      token,
      envVars.JWT_ACCESS_SECRET
    ) as JwtPayload;

    const userId = decodedToken.userId;

    const result = await RideService.requestRide(userId, req.body);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Ride requested successfully",
      data: result,
    });
  }
);

const getAvailableRides = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await RideService.getAvailableRides();
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Available rides retrieved",
      data: result,
    });
  }
);

const acceptRide = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { rideId } = req.params;

    const token = req.headers.authorization as string;
    const decodedToken = verifyToken(
      token,
      envVars.JWT_ACCESS_SECRET
    ) as JwtPayload;

    const userId = decodedToken.userId;

    const result = await RideService.acceptRide(rideId, userId);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Ride accepted successfully",
      data: result,
    });
  }
);

const updateRideStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { rideId } = req.params;
    const { status } = req.body;

    const token = req.headers.authorization as string;
    const decodedToken = verifyToken(
      token,
      envVars.JWT_ACCESS_SECRET
    ) as JwtPayload;

    const userId = decodedToken.userId;

    const result = await RideService.updateRideStatus(rideId, userId, status);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Ride status updated",
      data: result,
    });
  }
);

const getRideHistory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await RideService.getRideHistory(
      req.user.userId,
      req.user.role
    );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Ride history retrieved",
      data: result,
    });
  }
);

const cancelRide = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { rideId } = req.params;
  const { reason } = req.body;
  const result = await RideService.cancelRide(rideId, req.user.userId, reason);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Ride cancelled successfully',
    data: result,
  });
});

export const RideController = {
  requestRide,
  getAvailableRides,
  acceptRide,
  updateRideStatus,
  getRideHistory,
  cancelRide
};
