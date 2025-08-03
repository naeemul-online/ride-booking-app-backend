import { Driver } from "../driver/driver.model";
import { Ride } from "./ride.model";

/* eslint-disable @typescript-eslint/no-explicit-any */
const calculateFare = (pickup: any, destination: any) => {
  // Simple fare calculation based on distance approximation
  const latDiff = Math.abs(
    pickup.coordinates.lat - destination.coordinates.lat
  );
  const lngDiff = Math.abs(
    pickup.coordinates.lng - destination.coordinates.lng
  );
  const distance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);
  return Math.max(50, Math.round(distance * 1000)); // Minimum 50, ~1000 per unit distance
};

const requestRide = async (riderId: string, rideData: any) => {
  const fare = calculateFare(rideData.pickup, rideData.destination);

  const ride = await Ride.create({
    riderId,
    ...rideData,
    fare,
    requestedAt: new Date(),
  });

  return ride;
};

const getAvailableRides = async () => {
  const rides = await Ride.find({ status: "requested" })
    .populate("riderId", "name phone")
    .sort({ requestedAt: -1 });
  return rides;
};

const acceptRide = async (rideId: string, driverId: string) => {
  // Check if driver is approved and online
  const driver = await Driver.findOne({
    userId: driverId,
    approvalStatus: "approved",
    isOnline: true,
  });
  if (!driver) {
    throw new Error("Driver not approved or offline");
  }

  const ride = await Ride.findOneAndUpdate(
    { _id: rideId, status: "requested" },
    {
      driverId,
      status: "accepted",
      acceptedAt: new Date(),
    },
    { new: true }
  ).populate("riderId", "name phone");

  if (!ride) {
    throw new Error("Ride not available");
  }

  return ride;
};

const updateRideStatus = async (
  rideId: string,
  driverId: string,
  status: string
) => {
  const updateData: any = { status };

  if (status === "picked_up") updateData.pickedUpAt = new Date();
  if (status === "completed") {
    updateData.completedAt = new Date();
    // Update driver earnings
    const ride = await Ride.findById(rideId);
    if (ride) {
      await Driver.findOneAndUpdate(
        { userId: driverId },
        { $inc: { earnings: ride.fare } }
      );
    }
  }

  const ride = await Ride.findOneAndUpdate(
    {
      _id: rideId,
      driverId,
      status: { $in: ["accepted", "picked_up", "in_transit"] },
    },
    updateData,
    { new: true }
  ).populate("riderId driverId", "name phone");

  return ride;
};

const getRideHistory = async (userId: string, role: string) => {
  const query = role === "driver" ? { driverId: userId } : { riderId: userId };
  const rides = await Ride.find(query)
    .populate("riderId driverId", "name phone")
    .sort({ createdAt: -1 });
  return rides;
};

const cancelRide = async (rideId: string, userId: string, reason: string) => {
  const ride = await Ride.findOneAndUpdate(
    {
      _id: rideId,
      $or: [{ riderId: userId }, { driverId: userId }],
      status: { $in: ["requested", "accepted"] },
    },
    {
      status: "cancelled",
      cancelledAt: new Date(),
      cancellationReason: reason,
    },
    { new: true }
  );

  if (!ride) {
    throw new Error("Ride cannot be cancelled");
  }

  return ride;
};

export const RideService = {
  requestRide,
  getAvailableRides,
  acceptRide,
  updateRideStatus,
  getRideHistory,
  cancelRide,
};
