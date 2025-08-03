"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserZodSchema = exports.createUserZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const user_interface_1 = require("./user.interface");
const authProviderSchema = zod_1.default.object({
    provider: zod_1.default.enum(["google", "credentials"], {
        message: "Provider must be 'google' or 'credentials'",
    }),
    providerId: zod_1.default
        .string({ message: "ProviderId must be a string" })
        .min(1, { message: "ProviderId cannot be empty" }),
});
exports.createUserZodSchema = zod_1.default.object({
    name: zod_1.default
        .string({ message: "Name must be string" })
        .min(2, { message: "Name must be at least 2 characters long" })
        .max(50, { message: "Name cannot exceed 50 characters" }),
    email: zod_1.default
        .string({ message: "Email must be string" })
        .email({ message: "Invalid email address format" })
        .min(5, { message: "Email must be at least 5 characters long" })
        .max(100, { message: "Email cannot exceed 100 characters" }),
    password: zod_1.default
        .string({ message: "Password must be string" })
        .min(8, { message: "Password must be at least 8 characters long" })
        .regex(/^(?=.*[A-Z])/, {
        message: "Password must contain at least 1 uppercase letter",
    })
        .regex(/^(?=.*[!@#$%^&*])/, {
        message: "Password must contain at least 1 special character",
    })
        .regex(/^(?=.*\d)/, {
        message: "Password must contain at least 1 number",
    })
        .optional(),
    phone: zod_1.default
        .string({ message: "Phone Number must be string" })
        .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
        message: "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
    })
        .optional(),
    address: zod_1.default
        .string({ message: "Address must be string" })
        .max(200, { message: "Address cannot exceed 200 characters" })
        .optional(),
    picture: zod_1.default
        .string({ message: "Picture must be a string" })
        .url({ message: "Picture must be a valid URL" })
        .optional(),
    role: zod_1.default
        .enum(Object.values(user_interface_1.Role), {
        message: "Invalid role value",
    })
        .optional(),
    auth: zod_1.default
        .array(authProviderSchema)
        .min(1, { message: "At least one auth provider is required" })
        .optional(),
    IStatus: zod_1.default.enum(Object.values(user_interface_1.IStatus)).optional(),
    isVerified: zod_1.default.boolean({ message: "isVerified must be a boolean" }).optional(),
    isApproved: zod_1.default.boolean({ message: "isApproved must be a boolean" }).optional(),
    isAvailable: zod_1.default
        .boolean({ message: "isAvailable must be a boolean" })
        .optional(),
    vehicleInfo: zod_1.default
        .string({ message: "VehicleInfo must be a string" })
        .max(200, { message: "VehicleInfo cannot exceed 200 characters" })
        .optional(),
    totalEarnings: zod_1.default
        .number({ message: "TotalEarnings must be a number" })
        .nonnegative({ message: "TotalEarnings cannot be negative" })
        .optional(),
});
exports.updateUserZodSchema = zod_1.default.object({
    name: zod_1.default
        .string({ message: "Name must be string" })
        .min(2, { message: "Name must be at least 2 characters long" })
        .max(50, { message: "Name cannot exceed 50 characters" })
        .optional(),
    email: zod_1.default
        .string({ message: "Email must be string" })
        .email({ message: "Invalid email address format" })
        .min(5, { message: "Email must be at least 5 characters long" })
        .max(100, { message: "Email cannot exceed 100 characters" })
        .optional(),
    password: zod_1.default
        .string({ message: "Password must be string" })
        .min(8, { message: "Password must be at least 8 characters long" })
        .regex(/^(?=.*[A-Z])/, {
        message: "Password must contain at least 1 uppercase letter",
    })
        .regex(/^(?=.*[!@#$%^&*])/, {
        message: "Password must contain at least 1 special character",
    })
        .regex(/^(?=.*\d)/, {
        message: "Password must contain at least 1 number",
    })
        .optional(),
    phone: zod_1.default
        .string({ message: "Phone Number must be string" })
        .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
        message: "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
    })
        .optional(),
    address: zod_1.default
        .string({ message: "Address must be string" })
        .max(200, { message: "Address cannot exceed 200 characters" })
        .optional(),
    picture: zod_1.default
        .string({ message: "Picture must be a string" })
        .url({ message: "Picture must be a valid URL" })
        .optional(),
    role: zod_1.default
        .enum(Object.values(user_interface_1.Role), {
        message: "Invalid role value",
    })
        .optional(),
    auths: zod_1.default
        .array(authProviderSchema)
        .min(1, { message: "At least one auth provider is required" })
        .optional(),
    IStatus: zod_1.default.enum(Object.values(user_interface_1.IStatus)).optional(),
    isApproved: zod_1.default.boolean({ message: "isApproved must be a boolean" }).optional(),
    isAvailable: zod_1.default
        .boolean({ message: "isAvailable must be a boolean" })
        .optional(),
    vehicleInfo: zod_1.default
        .string({ message: "VehicleInfo must be a string" })
        .max(200, { message: "VehicleInfo cannot exceed 200 characters" })
        .optional(),
    totalEarnings: zod_1.default
        .number({ message: "TotalEarnings must be a number" })
        .nonnegative({ message: "TotalEarnings cannot be negative" })
        .optional(),
});
