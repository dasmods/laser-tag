import { HealthPickupsController } from "server/health-pickups/HealthPickupsController";
import { LasersController } from "server/lasers/LasersController";
import { PingController } from "server/ping/PingController";
import { Ack } from "shared/RemoteFunctions/Ack/Ack";

// controllers
new HealthPickupsController().init();
new LasersController().init();
new PingController().init();

// remote functions
new Ack().initServer();
