import { LaserFiredExternal } from "shared/Events/LaserFiredExternal/LaserFiredExternal";
import { ServerController } from "shared/util/controllers";

const LASER_FIRED_EXTERNAL = new LaserFiredExternal();

export class LasersController extends ServerController {
	init() {
		LASER_FIRED_EXTERNAL.onServerEvent((firedByPlayer: Player, initialCFrame: CFrame) => {
			LASER_FIRED_EXTERNAL.dispatchToAllClients(firedByPlayer, initialCFrame);
		});
	}
}
