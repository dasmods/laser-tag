import { LaserFiredRemoteEvent } from "shared/Events/LaserFiredRemote/LaserFiredRemoteEvent";
import { ServerController } from "shared/util/controllers";

export class LasersController extends ServerController {
	init() {
		LaserFiredRemoteEvent.onServerEvent((player: Player) => {
			print(`laser fired by ${player.Name}!`);
			LaserFiredRemoteEvent.dispatchToAllClients();
		});
	}
}
