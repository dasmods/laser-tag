import {
	LaserFiredClientToServerEvent,
	LaserFiredServerToClientEvent,
} from "shared/Events/LaserFiredRemote/LaserFiredRemote";
import { ServerController } from "shared/util/controllers";

export class LasersController extends ServerController {
	init() {
		new LaserFiredClientToServerEvent().onServerEvent((player: Player, cframe: CFrame) => {
			print(`laser fired by ${player.Name}!`);
			new LaserFiredServerToClientEvent().dispatchToAllClients(player, cframe);
		});
	}
}
