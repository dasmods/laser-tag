import { LaserFiredExternal } from "shared/Events/LaserFiredExternal/LaserFiredExternal";
import { ServerController } from "shared/util/controllers";

const LASER_FIRED_EXTERNAL = new LaserFiredExternal();

export class LasersController extends ServerController {
	init() {
		LASER_FIRED_EXTERNAL.onServerEvent((firedBy: Player, firedAt: number, firedFrom: CFrame) => {
			wait(5);
			LASER_FIRED_EXTERNAL.dispatchToAllClients(firedBy, firedAt, firedFrom);
		});
	}
}
