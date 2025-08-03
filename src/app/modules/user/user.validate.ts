import z from "zod";
import { IStatus, Role } from "./user.interface";

const authProviderSchema = z.object({
  provider: z.enum(["google", "credentials"], {
    message: "Provider must be 'google' or 'credentials'",
  }),
  providerId: z
    .string({ message: "ProviderId must be a string" })
    .min(1, { message: "ProviderId cannot be empty" }),
});

export const createUserZodSchema = z.object({
  name: z
    .string({ message: "Name must be string" })
    .min(2, { message: "Name must be at least 2 characters long" })
    .max(50, { message: "Name cannot exceed 50 characters" }),
  email: z
    .string({ message: "Email must be string" })
    .email({ message: "Invalid email address format" })
    .min(5, { message: "Email must be at least 5 characters long" })
    .max(100, { message: "Email cannot exceed 100 characters" }),
  password: z
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
  phone: z
    .string({ message: "Phone Number must be string" })
    .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
      message:
        "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
    })
    .optional(),
  address: z
    .string({ message: "Address must be string" })
    .max(200, { message: "Address cannot exceed 200 characters" })
    .optional(),
  picture: z
    .string({ message: "Picture must be a string" })
    .url({ message: "Picture must be a valid URL" })
    .optional(),
  role: z
    .enum(Object.values(Role) as [string], {
      message: "Invalid role value",
    })
    .optional(),
  auth: z
    .array(authProviderSchema)
    .min(1, { message: "At least one auth provider is required" })
    .optional(),
  IStatus: z.enum(Object.values(IStatus) as [string]).optional(),
  isVerified: z.boolean({ message: "isVerified must be a boolean" }).optional(),
  isApproved: z.boolean({ message: "isApproved must be a boolean" }).optional(),
  isAvailable: z
    .boolean({ message: "isAvailable must be a boolean" })
    .optional(),

  vehicleInfo: z
    .string({ message: "VehicleInfo must be a string" })
    .max(200, { message: "VehicleInfo cannot exceed 200 characters" })
    .optional(),
  totalEarnings: z
    .number({ message: "TotalEarnings must be a number" })
    .nonnegative({ message: "TotalEarnings cannot be negative" })
    .optional(),
});

export const updateUserZodSchema = z.object({
  name: z
    .string({ message: "Name must be string" })
    .min(2, { message: "Name must be at least 2 characters long" })
    .max(50, { message: "Name cannot exceed 50 characters" })
    .optional(),
  email: z
    .string({ message: "Email must be string" })
    .email({ message: "Invalid email address format" })
    .min(5, { message: "Email must be at least 5 characters long" })
    .max(100, { message: "Email cannot exceed 100 characters" })
    .optional(),
  password: z
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
  phone: z
    .string({ message: "Phone Number must be string" })
    .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
      message:
        "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
    })
    .optional(),
  address: z
    .string({ message: "Address must be string" })
    .max(200, { message: "Address cannot exceed 200 characters" })
    .optional(),
  picture: z
    .string({ message: "Picture must be a string" })
    .url({ message: "Picture must be a valid URL" })
    .optional(),
  role: z
    .enum(Object.values(Role) as [string], {
      message: "Invalid role value",
    })
    .optional(),
  auths: z
    .array(authProviderSchema)
    .min(1, { message: "At least one auth provider is required" })
    .optional(),
  IStatus: z.enum(Object.values(IStatus) as [string]).optional(),
  isApproved: z.boolean({ message: "isApproved must be a boolean" }).optional(),
  isAvailable: z
    .boolean({ message: "isAvailable must be a boolean" })
    .optional(),
  vehicleInfo: z
    .string({ message: "VehicleInfo must be a string" })
    .max(200, { message: "VehicleInfo cannot exceed 200 characters" })
    .optional(),
  totalEarnings: z
    .number({ message: "TotalEarnings must be a number" })
    .nonnegative({ message: "TotalEarnings cannot be negative" })
    .optional(),
});
