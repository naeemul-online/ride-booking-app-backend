/* eslint-disable @typescript-eslint/no-unused-vars */
import bcryptjs from "bcryptjs";
import { envVars } from "../config/env";
import { IAuthProvider, IUser, Role } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";

export const seedSuperAdmin = async () => {
  try {
    const isSuperAdmin = await User.findOne({
      email: envVars.super_admin_EMAIL,
    });
    if (isSuperAdmin) {
      console.log("Super admin Already Exists!");
      return;
    }

    console.log("trying to create super admin");
    const hashPassword = await bcryptjs.hash(
      envVars.super_admin_PASSWORD,
      Number(envVars.BCRYPT_SALT_ROUND)
    );

    const authProvider: IAuthProvider = {
      provider: "credentials",
      providerId: envVars.super_admin_EMAIL,
    };

    const payload: IUser = {
      name: "Super Admin",
      role: Role.super_admin,
      email: envVars.super_admin_EMAIL,
      password: hashPassword,
      auths: [authProvider],
    };

    const SupperAdmin = User.create(payload);
    console.log("super admin created successfully \n", SupperAdmin);
  } catch (error) {
    console.log(error);
  }
};
