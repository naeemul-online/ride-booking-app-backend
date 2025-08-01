import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";

import { UserControllers } from "./user.controller";
import { Role } from "./user.interface";
import { createUserZodSchema, updateUserZodSchema } from "./user.validate";

const router = Router();

router.post(
  "/register",
  validateRequest(createUserZodSchema),
  UserControllers.createUser
);

router.get(
  "/all-users",
  checkAuth(Role.admin, Role.super_admin),
  UserControllers.getAllUsers
);

router.get(
  "/drivers",
  checkAuth(Role.admin, Role.super_admin),
  UserControllers.getAllDrivers
);

router.get(
  "/rides",
  checkAuth(Role.admin, Role.super_admin),
  UserControllers.getAllRides
);

router.get(
  "/stats",
  checkAuth(Role.admin, Role.super_admin),
  UserControllers.getSystemStats
);

router.get(
  "/profile",
  checkAuth(...Object.values(Role)),
  UserControllers.getSingleUser
);

router.patch(
  "/:id",
  validateRequest(updateUserZodSchema),
  checkAuth(...Object.values(Role)),
  UserControllers.updateUser
);

router.patch(
  "/:userId/status",
  checkAuth(Role.super_admin, Role.super_admin),
  UserControllers.blockUnblockUser
);

router.patch(
  "/:driverId/approve",
  checkAuth(Role.super_admin, Role.super_admin),
  UserControllers.approveDriver
);

export const UserRoutes = router;
