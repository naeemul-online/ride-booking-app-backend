import { model, Schema } from "mongoose";
import { IApprovalStatus, IDriver } from "./diver.interface";

const driverSchema = new Schema<IDriver>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    licenseNumber: { type: String, required: true, unique: true },
    vehicleInfo: {
      type: { type: String, required: true },
      model: { type: String, required: true },
      plateNumber: { type: String, required: true },
    },
    approvalStatus: {
      type: String,
      enum: Object.values(IApprovalStatus),
      default: IApprovalStatus.pending,
    },
    isOnline: { type: Boolean, default: false },
    location: {
      lat: { type: Number, default: 0 },
      lng: { type: Number, default: 0 },
    },
    earnings: { type: Number, default: 0 },
    rating: { type: Number, default: 5 },
  },
  {
    timestamps: true,
  }
);

export const Driver = model<IDriver>("Driver", driverSchema);
