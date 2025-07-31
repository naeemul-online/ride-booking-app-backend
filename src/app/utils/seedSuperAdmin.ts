import bcryptjs from "bcryptjs";
import { envVars } from "../config/env";
import { IAuthProvider, IUser, Role } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";

export const seedSuperadmin = async () => {
  try {
    // todo:
    /* 
    1. check super admin is exist
    2. If super admin dose not exit create a super admin
    */

    const isSuperadmin = await User.findOne({
      email: envVars.super_admin_EMAIL,
    });
    if (isSuperadmin) {
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
      name: "Super admin",
      role: Role.super_admin,
      email: envVars.super_admin_EMAIL,
      password: hashPassword,
      isVerified: true,
      auths: [authProvider],
    };

    const superadmin = User.create(payload);
    console.log("super admin created successfully \n", superadmin);
  } catch (error) {
    console.log(error);
  }
};
