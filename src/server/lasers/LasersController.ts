import { LaserFiredExternal } from "shared/Events/LaserFiredExternal/LaserFiredExternal";
import { ServerController } from "shared/util/controllers";

const LASER_FIRED_EXTERNAL = new LaserFiredExternal();

export class LasersController extends ServerController {
	init() {
		LASER_FIRED_EXTERNAL.onServerEvent((firedBy: Player, pingMs: number, firedFrom: CFrame) => {
			// A ping represents a total roundtrip: client-server-client
			// Therefore, we only need half of the roundtrip.
			const halfPingRoundTripSec = pingMs / 1000 / 2;
			const firedAt = tick() - halfPingRoundTripSec;
			const firedAtSecAgo = tick() - firedAt;
			LASER_FIRED_EXTERNAL.dispatchToAllClients(firedBy, firedAtSecAgo, firedFrom);
		});
	}
}
