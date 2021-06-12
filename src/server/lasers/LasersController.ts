import { LaserFiredExternal } from "shared/Events/LaserFiredExternal/LaserFiredExternal";
import { ServerController } from "shared/util/controllers";

const LASER_FIRED_EXTERNAL = new LaserFiredExternal();

export class LasersController extends ServerController {
	init() {
		LASER_FIRED_EXTERNAL.onServerEvent((player: Player, cframe: CFrame) => {
			print(`laser fired by ${player.Name}!`);
			LASER_FIRED_EXTERNAL.dispatchToAllClients(player, cframe);
		});
	}
}
