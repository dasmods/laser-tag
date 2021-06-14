import { Players } from "@rbxts/services";
import { LatencyService } from "shared/time/LatencyService";
import { LaserFiredExternal } from "shared/Events/LaserFiredExternal/LaserFiredExternal";
import { LaserFiredInternal } from "shared/Events/LaserFiredInternal/LaserFiredInternal";
import { LaserModel } from "shared/lasers/LaserModel";
import { LASER_ENEMY_COLOR, LASER_FRIENDLY_COLOR, LASER_SPEED_STUDS_PER_SEC } from "shared/lasers/LasersConstants";
import { ClientController } from "shared/util/controllers";

const LASER_FIRED_INTERNAL = new LaserFiredInternal();
const LASER_FIRED_EXTERNAL = new LaserFiredExternal();
const LOCAL_PLAYER = Players.LocalPlayer;
const LATENCY_SERVICE = LatencyService.getInstance();

const approximateLaserCurrentCFrame = (firedAtSecAgo: number, firedFrom: CFrame): CFrame => {
	const offsetDistance = LASER_SPEED_STUDS_PER_SEC * firedAtSecAgo;
	return firedFrom.ToWorldSpace(new CFrame(0, 0, -offsetDistance));
};

const onLaserFiredInternal = (firedFrom: CFrame) => {
	const laser = LaserModel.create(LOCAL_PLAYER, firedFrom);
	laser.setColor(LASER_FRIENDLY_COLOR);

	const pingSec = LATENCY_SERVICE.getRunningAveragePingSec();
	LASER_FIRED_EXTERNAL.dispatchToServer(laser.getLaserId(), pingSec, firedFrom);

	laser.render();
};

const onLaserFiredExternal = (
	laserId: string,
	firedBy: Player,
	firedAtSecAgoFromServerPOV: number,
	firedFrom: CFrame,
) => {
	if (firedBy === LOCAL_PLAYER) {
		return;
	}
	// The time to receieve an event is approximately half the time it takes for
	// a full roundtrip ping.
	const timeToReceiveEventFromServerSec = LATENCY_SERVICE.getRunningAveragePingSec() / 2;
	const firedAtSecAgo = firedAtSecAgoFromServerPOV + timeToReceiveEventFromServerSec;
	const currentLaserCFrame = approximateLaserCurrentCFrame(firedAtSecAgo, firedFrom);
	const laser = LaserModel.createWithId(laserId, LOCAL_PLAYER, currentLaserCFrame);
	laser.setColor(LASER_ENEMY_COLOR);
	laser.render();
};

export class LasersController extends ClientController {
	init() {
		LASER_FIRED_INTERNAL.onEvent(onLaserFiredInternal);
		LASER_FIRED_EXTERNAL.onClientEvent(onLaserFiredExternal);
	}
}
