import { LaserFiredExternal } from "shared/Events/LaserFiredExternal/LaserFiredExternal";
import { ServerController } from "shared/util/controllers";

const LASER_FIRED_EXTERNAL = new LaserFiredExternal();

const validateLaserFired = (player: Player, initialVelocity: CFrame) => {};

export class LasersController extends ServerController {
	init() {
		LASER_FIRED_EXTERNAL.onServerEvent((player: Player, initialVelocity: CFrame) => {
			validateLaserFired(player, initialVelocity);
			LASER_FIRED_EXTERNAL.dispatchToAllClients(player, initialVelocity);
		});
	}
}
