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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const env_1 = require("../../config/env");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const driver_model_1 = require("../driver/driver.model");
const ride_model_1 = require("../ride/ride.model");
const user_constant_1 = require("./user.constant");
const user_model_1 = require("./user.model");
const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, role, password } = payload, rest = __rest(payload, ["email", "role", "password"]);
    if (role === "admin" || role === "super_admin") {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `You are not authorized for creating ${role} account`);
    }
    const isUserExist = yield user_model_1.User.findOne({ email });
    if (isUserExist) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User Already Exist");
    }
    const hashedPassword = yield bcryptjs_1.default.hash(password, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    const authProvider = {
        provider: "credentials",
        providerId: email,
    };
    const user = yield user_model_1.User.create(Object.assign({ email, password: hashedPassword, role, auths: [authProvider] }, rest));
    return user;
});
const getAllUsers = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryBuilder = new QueryBuilder_1.QueryBuilder(user_model_1.User.find(), query);
    const users = yield queryBuilder
        .search(user_constant_1.userSearchableFields)
        .filter()
        .sort()
        .fields()
        .paginate();
    const [data, meta] = yield Promise.all([
        users.build(),
        queryBuilder.getMeta(),
    ]);
    return { data, meta };
});
const getSingleUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(id).select("-password");
    return user;
});
const updateUser = (userId, payload, requester) => __awaiter(void 0, void 0, void 0, function* () {
    if (payload.role === "admin" && requester.role !== "super_admin") {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "Only super_admin can assign admin role");
    }
    const ifUserExist = yield user_model_1.User.findById(userId);
    if (!ifUserExist) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User Not Found");
    }
    if (payload.password) {
        payload.password = yield bcryptjs_1.default.hash(payload.password, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    }
    const newUpdatedUser = yield user_model_1.User.findByIdAndUpdate(userId, payload, {
        new: true,
        runValidators: true,
    });
    return newUpdatedUser;
});
const blockUnblockUser = (userId, status) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findByIdAndUpdate(userId, { status }, { new: true }).select("-password");
    return user;
});
const getAllDrivers = () => __awaiter(void 0, void 0, void 0, function* () {
    const drivers = yield driver_model_1.Driver.find({})
        .populate("userId", "name email phone status")
        .sort({ createdAt: -1 });
    const totalDrivers = yield driver_model_1.Driver.countDocuments();
    return { totalDrivers, drivers };
});
const approveDriver = (driverId, approvalStatus) => __awaiter(void 0, void 0, void 0, function* () {
    const driver = yield driver_model_1.Driver.findByIdAndUpdate(driverId, { approvalStatus }, { new: true }).populate("userId", "name email phone");
    return driver;
});
const getAllRides = () => __awaiter(void 0, void 0, void 0, function* () {
    const rides = yield ride_model_1.Ride.find({})
        .populate("riderId driverId", "name phone")
        .sort({ createdAt: -1 });
    const totalRides = yield ride_model_1.Ride.countDocuments();
    return { totalRides, rides };
});
const getSystemStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const totalUsers = yield user_model_1.User.countDocuments();
    const totalDrivers = yield driver_model_1.Driver.countDocuments();
    const totalRides = yield ride_model_1.Ride.countDocuments();
    const completedRides = yield ride_model_1.Ride.countDocuments({ status: "completed" });
    const activeRides = yield ride_model_1.Ride.countDocuments({
        status: { $in: ["requested", "accepted", "picked_up", "in_transit"] },
    });
    return {
        totalUsers,
        totalDrivers,
        totalRides,
        completedRides,
        activeRides,
    };
});
exports.UserService = {
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
