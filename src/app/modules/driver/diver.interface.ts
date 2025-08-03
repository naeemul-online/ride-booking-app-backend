import { Schema } from "mongoose";

export enum IApprovalStatus {
  pending = "pending",
  approved = "approved",
  suspend = "suspended",
}

export interface IDriver {
  userId?: Schema.Types.ObjectId;
  licenseNumber: string;
  vehicleInfo: {
    type: string;
    model: string;
    plateNumber: string;
  };
  approvalStatus: IApprovalStatus;
  isOnline: boolean;
  location: {
    lat: number;
    lng: number;
  };
  earnings: number;
  rating: number
}
