import { HealthPickupsController } from "server/health-pickups/HealthPickupsController";
import { LasersController } from "server/lasers/LasersController";
import { Ack } from "shared/RemoteFunctions/Ack/Ack";

// controllers
new HealthPickupsController().init();
new LasersController().init();

// remote functions
new Ack().initServer();
