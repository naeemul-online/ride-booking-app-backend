export enum Role {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  RIDER = "RIDER",
  DRIVER = "DRIVER",
}

export interface IAuthProvider {
  provider: "google" | "credentials";
  providerId: string;
}

export enum IsActive {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCKED = "BLOCKED",
}

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  address?: string;
  picture?: string;
  role: Role;
  auths?: IAuthProvider[];
  isActive?: IsActive;
  isVerified?: boolean;
  isDeleted?: boolean;
  isApproved?: boolean;
  isAvailable?: boolean;
  vehicleInfo?: string;
  totalEarnings?: number;
}
