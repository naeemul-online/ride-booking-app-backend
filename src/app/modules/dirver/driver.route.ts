import { Router } from "express";
import { DriverController } from "./driver.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

const router = Router();

router.post("/register", DriverController.registerDriver);
router.post("/status", checkAuth(Role.driver), DriverController.updateStatus);
router.get("/earnings", checkAuth(Role.driver), DriverController.getEarnings);

export const DriverRoutes = router;
