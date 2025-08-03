import bcryptjs from "bcryptjs";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/AppError";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { Driver } from "../driver/driver.model";
import { Ride } from "../ride/ride.model";
import { userSearchableFields } from "./user.constant";
import { IAuthProvider, IStatus, IUser } from "./user.interface";
import { User } from "./user.model";

const createUser = async (payload: Partial<IUser>) => {
  const { email, role, password, ...rest } = payload;

  if (role === "admin" || role === "super_admin") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `You are not authorized for creating ${role} account`
    );
  }

  const isUserExist = await User.findOne({ email });

  if (isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User Already Exist");
  }

  const hashedPassword = await bcryptjs.hash(
    password as string,
    Number(envVars.BCRYPT_SALT_ROUND)
  );

  const authProvider: IAuthProvider = {
    provider: "credentials",
    providerId: email as string,
  };

  const user = await User.create({
    email,
    password: hashedPassword,
    role,
    auths: [authProvider],
    ...rest,
  });
  return user;
};

const getAllUsers = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(User.find(), query);
  const users = await queryBuilder
    .search(userSearchableFields)
    .filter()
    .sort()
    .fields()
    .paginate();
  const [data, meta] = await Promise.all([
    users.build(),
    queryBuilder.getMeta(),
  ]);

  return { data, meta };
};

const getSingleUser = async (id: string) => {
  const user = await User.findById(id).select("-password");
  return user;
};

const updateUser = async (
  userId: string,
  payload: Partial<IUser>,
  requester: JwtPayload
) => {
  if (payload.role === "admin" && requester.role !== "super_admin") {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Only super_admin can assign admin role"
    );
  }
  const ifUserExist = await User.findById(userId);

  if (!ifUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
  }

  if (payload.password) {
    payload.password = await bcryptjs.hash(
      payload.password,
      Number(envVars.BCRYPT_SALT_ROUND)
    );
  }

  const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });

  return newUpdatedUser;
};

const blockUnblockUser = async (userId: string, status: IStatus) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { status },
    { new: true }
  ).select("-password");
  return user;
};

const getAllDrivers = async () => {
  const drivers = await Driver.find({})
    .populate("userId", "name email phone status")
    .sort({ createdAt: -1 });
  const totalDrivers = await Driver.countDocuments();
  return { totalDrivers, drivers };
};

const approveDriver = async (
  driverId: string,
  approvalStatus: "approved" | "suspended"
) => {
  const driver = await Driver.findByIdAndUpdate(
    driverId,
    { approvalStatus },
    { new: true }
  ).populate("userId", "name email phone");
  return driver;
};

const getAllRides = async () => {
  const rides = await Ride.find({})
    .populate("riderId driverId", "name phone")
    .sort({ createdAt: -1 });
  const totalRides = await Ride.countDocuments();

  return { totalRides, rides };
};
const getSystemStats = async () => {
  const totalUsers = await User.countDocuments();
  const totalDrivers = await Driver.countDocuments();
  const totalRides = await Ride.countDocuments();
  const completedRides = await Ride.countDocuments({ status: "completed" });
  const activeRides = await Ride.countDocuments({
    status: { $in: ["requested", "accepted", "picked_up", "in_transit"] },
  });

  return {
    totalUsers,
    totalDrivers,
    totalRides,
    completedRides,
    activeRides,
  };
};

export const UserService = {
  createUser,
  getAllUsers,
  updateUser,
  getSingleUser,
  blockUnblockUser,
  getAllDrivers,
  approveDriver,
  getAllRides,
  getSystemStats,
};
