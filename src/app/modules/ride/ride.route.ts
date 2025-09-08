import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { RideController } from "./ride.controller";

const router = Router();

router.post("/request", checkAuth(Role.rider), RideController.requestRide);

router.get(
  "/available",
  checkAuth(...Object.values(Role)),
  RideController.getAvailableRides
);

router.get(
  "/:id/current-ride",
  checkAuth(Role.rider),
  RideController.getCurrentRide
);

router.get(
  "/history",
  checkAuth(...Object.values(Role)),
  RideController.getRideHistory
);

router.get(
  "/:id",
  checkAuth(...Object.values(Role)),
  RideController.getSingleRide
);

router.patch(
  "/:rideId/accept",
  checkAuth(Role.driver),
  RideController.acceptRide
);

router.patch(
  "/:rideId/status",
  checkAuth(Role.driver),
  RideController.updateRideStatus
);

router.patch(
  "/:rideId/cancel",
  checkAuth(...Object.values(Role)),
  RideController.cancelRide
);

export const RideRouts = router;
