import { t } from "@rbxts/t";
import { LaserFiredExternal } from "shared/Events/LaserFiredExternal/LaserFiredExternal";
import { LaserHitExternal } from "shared/Events/LaserHitExternal/LaserHitExternal";
import { LASER_DAMAGE } from "shared/lasers/LasersConstants";
import { ServerController } from "shared/util/controllers";

const LASER_FIRED_EXTERNAL = new LaserFiredExternal();
const LASER_HIT_EXTERNAL = new LaserHitExternal();

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

		LASER_HIT_EXTERNAL.onServerEvent((reportedBy: Player, hitModel: Model) => {
			const humanoid = hitModel.FindFirstChild("Humanoid");
			if (t.instanceIsA("Humanoid")(humanoid)) {
				humanoid.Health -= LASER_DAMAGE;
			}
		});
	}
}
