import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { IDriver } from "./diver.interface";
import { Driver } from "./driver.model";
import { Ride } from "../ride/ride.model";

const registerDriver = async (userId: string, driverData: Partial<IDriver>) => {
  const existingDriver = await Driver.findOne({ userId });
  if (existingDriver) {
    throw new AppError(httpStatus.CONFLICT, "driver already registered");
  }
  const driver = await Driver.create({ userId, ...driverData });
  return driver;
};

const updateDriverStatus = async (userId: string, isOnline: boolean) => {
  const driver = await Driver.findOneAndUpdate(
    { userId },
    { isOnline },
    { new: true }
  );
  if (!driver) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Driver not found or not approved"
    );
  }
  return driver;
};

const updateLocation = async (
  userId: string,
  location: { lat: number; lng: number }
) => {
  const driver = await Driver.findOneAndUpdate(
    { userId },
    { location },
    { new: true }
  );
  return driver;
};

const getDriverRides = async (userId: string) => {
  const rides = await Ride.find({ driverId: userId })
    .populate("riderId", "name phone")
    .sort({ createdAt: -1 });
  return rides;
};

const getDriverEarnings = async (userId: string) => {
  const driver = await Driver.findOne({ userId }).populate(
    "userId",
    "name email"
  );
  const totalRides = await Ride.countDocuments({
    driverId: userId,
    status: "completed",
  });
  const todayEarnings = await Ride.aggregate([
    {
      $match: {
        driverId: userId,
        status: "completed",
        completedAt: {
          $gte: new Date(new Date().setHours(0, 0, 0, 0)),
          $lt: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      },
    },
    { $group: { _id: null, total: { $sum: "$fare" } } },
  ]);

  return {
    driver,
    totalEarnings: driver?.earnings || 0,
    todayEarnings: todayEarnings[0]?.total || 0,
    totalRides,
  };
};

export const DriverService = {
  registerDriver,
  updateDriverStatus,
  getDriverEarnings,
  updateLocation,
  getDriverRides,
};
