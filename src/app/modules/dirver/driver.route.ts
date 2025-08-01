import { Router } from "express";
import { DriverController } from "./driver.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

const router = Router();

router.post("/register", DriverController.registerDriver);
router.post("/status", checkAuth(Role.driver), DriverController.updateStatus);
router.get("/earnings", checkAuth(Role.driver), DriverController.getEarnings);
router.get("/location", checkAuth(Role.driver), DriverController.updateLocation);
router.get("/rides", checkAuth(Role.driver), DriverController.getDriverRides);

export const DriverRoutes = router;
