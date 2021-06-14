import { HealthPickupsController } from "server/health-pickups/HealthPickupsController";
import { LasersController } from "server/lasers/LasersController";
import { AckServerFunction } from "shared/RemoteFunctions/AckServerFunction/AckServerFunction";

// controllers
new HealthPickupsController().init();
new LasersController().init();

// remote functions
new AckServerFunction().initServer();
