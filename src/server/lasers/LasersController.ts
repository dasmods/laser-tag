import { LaserFiredEvent } from "shared/Events/LaserFired/LaserFiredEvent";
import { ServerController } from "shared/util/controllers";

export class LasersController extends ServerController {
	init() {
		LaserFiredEvent.onServerEvent((player: Player) => {
			print(`laser fired by ${player.Name}!`);
		});
	}
}
