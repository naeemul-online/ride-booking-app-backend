import { IDriver } from "./diver.interface";
import { Driver } from "./driver.model";

const registerDriver = async (userId: string, driverData: Partial<IDriver>) => {
  const driver = await Driver.create({ userId, ...driverData });
  return driver;
};

const updateDriverStatus = async (userId: string, isOnline: boolean) => {
  const driver = await Driver.findOneAndUpdate(
    { userId },
    { isOnline },
    { new: true }
  );
  return driver;
};

const getDriverEarnings = async (userId: string) => {
  const driver = await Driver.findOne({ userId }).populate(
    "userId",
    "name email"
  );

  return { earnings: driver?.earnings || 0, driver };
};

export const DriverService = {
  registerDriver,
  updateDriverStatus,
  getDriverEarnings,
};
