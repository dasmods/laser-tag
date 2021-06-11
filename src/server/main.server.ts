import { HealthPickupsController } from "server/health-pickups/HealthPickupsController";
import { LasersController } from "server/lasers/LasersController";

new HealthPickupsController().init();
new LasersController().init();
