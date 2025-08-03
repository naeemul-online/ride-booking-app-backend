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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverService = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const ride_model_1 = require("../ride/ride.model");
const driver_model_1 = require("./driver.model");
const registerDriver = (userId, driverData) => __awaiter(void 0, void 0, void 0, function* () {
    const existingDriver = yield driver_model_1.Driver.findOne({ userId });
    if (existingDriver) {
        throw new AppError_1.default(http_status_codes_1.default.CONFLICT, "driver already registered");
    }
    const driver = yield driver_model_1.Driver.create(Object.assign({ userId }, driverData));
    return driver;
});
const updateDriverStatus = (userId, isOnline) => __awaiter(void 0, void 0, void 0, function* () {
    const driver = yield driver_model_1.Driver.findOneAndUpdate({ userId }, { isOnline }, { new: true });
    if (!driver) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Driver not found or not approved");
    }
    return driver;
});
const updateLocation = (userId, location) => __awaiter(void 0, void 0, void 0, function* () {
    const driver = yield driver_model_1.Driver.findOneAndUpdate({ userId }, { location }, { new: true });
    return driver;
});
const getDriverRides = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const rides = yield ride_model_1.Ride.find({ driverId: userId })
        .populate("riderId", "name phone")
        .sort({ createdAt: -1 });
    return rides;
});
const getDriverEarnings = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const driver = yield driver_model_1.Driver.findOne({ userId }).populate("userId", "name email");
    const totalRides = yield ride_model_1.Ride.countDocuments({
        driverId: userId,
        status: "completed",
    });
    const todayEarnings = yield ride_model_1.Ride.aggregate([
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
        totalEarnings: (driver === null || driver === void 0 ? void 0 : driver.earnings) || 0,
        todayEarnings: ((_a = todayEarnings[0]) === null || _a === void 0 ? void 0 : _a.total) || 0,
        totalRides,
    };
});
exports.DriverService = {
    registerDriver,
    updateDriverStatus,
    getDriverEarnings,
    updateLocation,
    getDriverRides,
};
