import { t } from "@rbxts/t";
import { LaserTracker } from "server/lasers/LaserTracker";
import { LaserFiredExternal } from "shared/Events/LaserFiredExternal/LaserFiredExternal";
import { LaserHitExternal } from "shared/Events/LaserHitExternal/LaserHitExternal";
import { LASER_DAMAGE } from "shared/lasers/LasersConstants";
import { ServerController } from "shared/util/controllers";

const LASER_FIRED_EXTERNAL = new LaserFiredExternal();
const LASER_HIT_EXTERNAL = new LaserHitExternal();
const LASER_TRACKER = new LaserTracker();

const getHumanoid = (parts: BasePart[]) => {
	let humanoid: Humanoid | undefined;
	for (const part of parts) {
		const parent = part.Parent;
		const grandparent = parent?.Parent;

		humanoid = parent?.FindFirstChildWhichIsA("Humanoid") || grandparent?.FindFirstChildWhichIsA("Humanoid");

		if (!t.nil(humanoid)) {
			return humanoid;
		}
	}
};

export class LasersController extends ServerController {
	init() {
		LASER_FIRED_EXTERNAL.onServerEvent((firedBy: Player, laserId: string, pingMs: number, firedFrom: CFrame) => {
			// A ping represents a total roundtrip: client-server-client
			// Therefore, we only need half of the roundtrip. Assume that
			// the time it takes for a client to reach the server is the
			// amount of time the laser was fired ago.
			const firedAtSecAgo = pingMs / 1000 / 2;
			const firedAt = tick() - firedAtSecAgo;
			LASER_TRACKER.track(laserId, { firedAt, firedBy, firedFrom });
			LASER_FIRED_EXTERNAL.dispatchToAllClients(laserId, firedBy, firedAtSecAgo, firedFrom);
		});

		LASER_HIT_EXTERNAL.onServerEvent((reportedBy: Player, laserId: string) => {
			if (!LASER_TRACKER.isTracked(laserId)) {
				// The laser event for this laserId was never tracked or already untracked.
				return;
			}

			const hits = LASER_TRACKER.detectHits(laserId);
			LASER_TRACKER.untrack(laserId);

			const humanoid = getHumanoid(hits);
			if (t.instanceIsA("Humanoid")(humanoid)) {
				humanoid.TakeDamage(LASER_DAMAGE);
			}
		});
	}
}
