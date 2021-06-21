import { PingTracker } from "server/ping/PingTracker";
import { LaserFiredExternal } from "shared/Events/LaserFiredExternal/LaserFiredExternal";
import { LaserModel } from "shared/lasers/LaserModel";
import { LASER_SPEED_STUDS_PER_SEC } from "shared/lasers/LasersConstants";
import { TimeService } from "shared/time/TimeService";
import { ServerController } from "shared/util/controllers";

const LASER_FIRED_EXTERNAL = new LaserFiredExternal();
const TIME_SERVICE = TimeService.getInstance();
const PING_TRACKER = PingTracker.getInstance();

const approxLaserCurrentCFrame = (firedAtSecAgo: number, firedFrom: CFrame): CFrame => {
	const offsetDistance = LASER_SPEED_STUDS_PER_SEC * firedAtSecAgo;
	return firedFrom.ToWorldSpace(new CFrame(0, 0, -offsetDistance));
};

export class LasersController extends ServerController {
	init() {
		LASER_FIRED_EXTERNAL.onServerEvent((firedBy: Player, laserId: string, firedAt: number, firedFrom: CFrame) => {
			const approxSecToReceiveEvent = PING_TRACKER.getAvgPingSec(firedBy) / 2;
			const firedAtSecAgo = TIME_SERVICE.now() - firedAt + approxSecToReceiveEvent;
			const approximateFiredFrom = approxLaserCurrentCFrame(firedAtSecAgo, firedFrom);
			const laser = LaserModel.createWithId(laserId, approximateFiredFrom);
			laser.renderAsTracer(firedAtSecAgo);

			LASER_FIRED_EXTERNAL.dispatchToAllClients(laserId, firedBy, firedAt, firedFrom);
		});
	}
}
