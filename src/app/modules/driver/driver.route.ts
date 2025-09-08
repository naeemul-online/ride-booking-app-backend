import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { DriverController } from "./driver.controller";

const router = Router();

router.post(
  "/register",
  checkAuth(Role.driver),
  DriverController.registerDriver
);
router.patch(
  "/status",
  checkAuth(Role.driver),
  DriverController.updateDriverStatus
);
router.get("/earnings", checkAuth(Role.driver), DriverController.getEarnings);
router.get("/status", checkAuth(Role.driver), DriverController.getDriverInfo);
router.patch(
  "/location",
  checkAuth(Role.driver),
  DriverController.updateLocation
);
router.get("/rides", checkAuth(Role.driver), DriverController.getDriverRides);

export const DriverRoutes = router;
