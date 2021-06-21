import { Ping } from "shared/Events/Ping/Ping";
import { ClientController } from "shared/util/controllers";

const PING = new Ping();

export class PingController extends ClientController {
	init() {
		PING.onClientEvent((pingId) => {
			PING.dispatchToServer(pingId);
		});
	}
}
