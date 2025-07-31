export enum Role {
  super_admin = "super_admin",
  admin = "admin",
  rider = "rider",
  driver = "driver",
}

export interface IAuthProvider {
  provider: "google" | "credentials";
  providerId: string;
}

export enum IStatus {
  active = "active",
  blocked = "blocked",
}

export interface IUser {
  _id?: string
  name: string;
  email: string;
  password?: string;
  phone?: string;
  picture?: string;
  role: Role;
  auths?: IAuthProvider[];
  status?: IStatus;
}
