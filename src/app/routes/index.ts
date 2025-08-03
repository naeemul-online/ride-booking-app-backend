import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.route";
import { DriverRoutes } from "../modules/driver/driver.route";
import { RideRouts } from "../modules/ride/ride.route";
import { UserRoutes } from "../modules/user/user.route";

export const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/driver",
    route: DriverRoutes,
  },
  {
    path: "/rides",
    route: RideRouts,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
