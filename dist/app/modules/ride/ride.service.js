"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RideService = void 0;
const driver_model_1 = require("../driver/driver.model");
const ride_model_1 = require("./ride.model");
/* eslint-disable @typescript-eslint/no-explicit-any */
const calculateFare = (pickup, destination) => {
    // Simple fare calculation based on distance approximation
    const latDiff = Math.abs(pickup.coordinates.lat - destination.coordinates.lat);
    const lngDiff = Math.abs(pickup.coordinates.lng - destination.coordinates.lng);
    const distance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);
    return Math.max(50, Math.round(distance * 1000)); // Minimum 50, ~1000 per unit distance
};
const requestRide = (riderId, rideData) => __awaiter(void 0, void 0, void 0, function* () {
    const fare = calculateFare(rideData.pickup, rideData.destination);
    const ride = yield ride_model_1.Ride.create(Object.assign(Object.assign({ riderId }, rideData), { fare, requestedAt: new Date() }));
    return ride;
});
const getAvailableRides = () => __awaiter(void 0, void 0, void 0, function* () {
    const rides = yield ride_model_1.Ride.find({ status: "requested" })
        .populate("riderId", "name phone")
        .sort({ requestedAt: -1 });
    return rides;
});
const acceptRide = (rideId, driverId) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if driver is approved and online
    const driver = yield driver_model_1.Driver.findOne({
        userId: driverId,
        approvalStatus: "approved",
        isOnline: true,
    });
    if (!driver) {
        throw new Error("Driver not approved or offline");
    }
    const ride = yield ride_model_1.Ride.findOneAndUpdate({ _id: rideId, status: "requested" }, {
        driverId,
        status: "accepted",
        acceptedAt: new Date(),
    }, { new: true }).populate("riderId", "name phone");
    if (!ride) {
        throw new Error("Ride not available");
    }
    return ride;
});
const updateRideStatus = (rideId, driverId, status) => __awaiter(void 0, void 0, void 0, function* () {
    const updateData = { status };
    if (status === "picked_up")
        updateData.pickedUpAt = new Date();
    if (status === "completed") {
        updateData.completedAt = new Date();
        // Update driver earnings
        const ride = yield ride_model_1.Ride.findById(rideId);
        if (ride) {
            yield driver_model_1.Driver.findOneAndUpdate({ userId: driverId }, { $inc: { earnings: ride.fare } });
        }
    }
    const ride = yield ride_model_1.Ride.findOneAndUpdate({
        _id: rideId,
        driverId,
        status: { $in: ["accepted", "picked_up", "in_transit"] },
    }, updateData, { new: true }).populate("riderId driverId", "name phone");
    return ride;
});
const getRideHistory = (userId, role) => __awaiter(void 0, void 0, void 0, function* () {
    const query = role === "driver" ? { driverId: userId } : { riderId: userId };
    const rides = yield ride_model_1.Ride.find(query)
        .populate("riderId driverId", "name phone")
        .sort({ createdAt: -1 });
    return rides;
});
const cancelRide = (rideId, userId, reason) => __awaiter(void 0, void 0, void 0, function* () {
    const ride = yield ride_model_1.Ride.findOneAndUpdate({
        _id: rideId,
        $or: [{ riderId: userId }, { driverId: userId }],
        status: { $in: ["requested", "accepted"] },
    }, {
        status: "cancelled",
        cancelledAt: new Date(),
        cancellationReason: reason,
    }, { new: true });
    if (!ride) {
        throw new Error("Ride cannot be cancelled");
    }
    return ride;
});
exports.RideService = {
    requestRide,
    getAvailableRides,
    acceptRide,
    updateRideStatus,
    getRideHistory,
    cancelRide,
};
