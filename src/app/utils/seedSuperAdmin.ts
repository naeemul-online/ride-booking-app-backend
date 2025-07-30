import bcryptjs from "bcryptjs";
import { envVars } from "../config/env";
import { IAuthProvider, IUser, Role } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";

export const seedSuperAdmin = async () => {
  try {
    // todo:
    /* 
    1. check super admin is exist
    2. If super admin dose not exit create a super admin
    */

    const isSuperAdmin = await User.findOne({
      email: envVars.SUPER_ADMIN_EMAIL,
    });
    if (isSuperAdmin) {
      console.log("Super Admin Already Exists!");
      return;
    }

    console.log("trying to create super admin");
    const hashPassword = await bcryptjs.hash(
      envVars.SUPER_ADMIN_PASSWORD,
      Number(envVars.BCRYPT_SALT_ROUND)
    );

    const authProvider: IAuthProvider = {
      provider: "credentials",
      providerId: envVars.SUPER_ADMIN_EMAIL,
    };

    const payload: IUser = {
      name: "Super Admin",
      role: Role.SUPER_ADMIN,
      email: envVars.SUPER_ADMIN_EMAIL,
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
