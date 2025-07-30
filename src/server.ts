import { Server } from "http";
import mongoose from "mongoose";
import { envVars } from "./app/config/env";
import { seedSuperAdmin } from "./app/utils/seedSuperAdmin";
import app from "./app";

let server: Server;

const startServer = async () => {
  try {
    await mongoose.connect(envVars.DB_URL);
    // eslint-disable-next-line no-console
    console.log("Connected to DB");
    server = app.listen(envVars.PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Server is listening to port ${envVars.PORT}`);
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }
};

(async () => {
  await startServer();
  await seedSuperAdmin();
})();

// unhandled rejection error
process.on("unhandledRejection", (err) => {
  // eslint-disable-next-line no-console
  console.log("Unhandled rejection detected... Server shutting down...", err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

// Uncaught Rejection Error
process.on("uncaughtException", (err) => {
  // eslint-disable-next-line no-console
  console.log("Uncaught Exception detected... Server shutting down...", err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

// unhandled rejection error
process.on("SIGTERM", () => {
  // eslint-disable-next-line no-console
  console.log("Sigterm signal recieved... Server shutting down...");
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});
