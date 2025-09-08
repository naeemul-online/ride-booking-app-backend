/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import passport from "passport";
import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/AppError";
import { catchAsync } from "../../utils/catchAsync";
import { verifyToken } from "../../utils/jwt";
import { sendResponse } from "../../utils/sendResponse";
import { setAuthCookie } from "../../utils/setCookie";
import { createUserTokens } from "../../utils/userToken";
import { UserService } from "./user.service";

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserService.createUser(req.body);

    passport.authenticate("local", async (err: any, user: any, info: any) => {
      if (err) {
        return next(new AppError(401, err));
      }

      if (!user) {
        return next(new AppError(401, info.message));
      }

      const userTokens = await createUserTokens(user);

      const { password: pass, ...rest } = user.toObject();

      setAuthCookie(res, userTokens);

      sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User Logged in  Successfully",
        data: {
          accessToken: userTokens.accessToken,
          refreshToken: userTokens.refreshToken,
          data: rest,
        },
      });
    })(req, res, next);

    // sendResponse(res, {
    //   success: true,
    //   statusCode: httpStatus.CREATED,
    //   message: "User Created Successfully",
    //   data: user,
    // });
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
      message: `User updated successfully`,
      data: result,
    });
  }
);
const deleteUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    const result = await UserService.deleteUser(userId);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: `User deleted successfully`,
      data: null,
    });
  }
);

const approveDriver = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { driverId } = req.params;
    const { approvalStatus } = req.body;
    console.log(driverId, approvalStatus);
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
    const token = req.headers.authorization || req.cookies.accessToken;
    const { userId } = verifyToken(
      token,
      envVars.JWT_ACCESS_SECRET
    ) as JwtPayload;

    const result = await UserService.getSingleUser(userId);
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
    const payload = req.body;

    const requester = req.user as JwtPayload;

    const user = await UserService.updateUser(userId, payload, requester);
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
  deleteUser,
};
