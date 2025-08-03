import { model, Schema } from "mongoose";
import { IAuthProvider, IStatus, IUser, Role } from "./user.interface";

const authProviderSchema = new Schema<IAuthProvider>(
  {
    provider: { type: String, required: true },
    providerId: { type: String, required: true },
  },
  { versionKey: false, _id: false }
);

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
    },
    phone: {
      type: String,
    },
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.rider,
    },
    status: {
      type: String,
      enum: Object.values(IStatus),
      default: IStatus.active,
    },
    auths: [authProviderSchema],
  },
  { timestamps: true }
);

export const User = model<IUser>("User", userSchema);
