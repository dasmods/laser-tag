import { Players } from "@rbxts/services";
import { TimeService } from "shared/time/TimeService";
import { LaserFiredExternal } from "shared/Events/LaserFiredExternal/LaserFiredExternal";
import { LaserFiredInternal } from "shared/Events/LaserFiredInternal/LaserFiredInternal";
import { LaserModel } from "shared/lasers/LaserModel";
import { LASER_ENEMY_COLOR, LASER_FRIENDLY_COLOR, LASER_SPEED_STUDS_PER_SEC } from "shared/lasers/LasersConstants";
import { ClientController } from "shared/util/controllers";

const LASER_FIRED_INTERNAL = new LaserFiredInternal();
const LASER_FIRED_EXTERNAL = new LaserFiredExternal();
const LOCAL_PLAYER = Players.LocalPlayer;
const TIME_SERVICE = TimeService.getInstance();

const approximateLaserCurrentCFrame = (firedAtSecAgo: number, firedFrom: CFrame): CFrame => {
	const offsetDistance = LASER_SPEED_STUDS_PER_SEC * firedAtSecAgo;
	return firedFrom.ToWorldSpace(new CFrame(0, 0, -offsetDistance));
};

const onLaserFiredInternal = (firedFrom: CFrame) => {
	const laser = LaserModel.create(firedFrom);
	laser.setColor(LASER_FRIENDLY_COLOR);
	LASER_FIRED_EXTERNAL.dispatchToServer(laser.getLaserId(), TIME_SERVICE.now(), firedFrom);
	laser.render();
};

const onLaserFiredExternal = (laserId: string, firedBy: Player, firedAt: number, firedFrom: CFrame) => {
	const firedAtSecAgo = TIME_SERVICE.now() - firedAt;
	const currentLaserCFrame = approximateLaserCurrentCFrame(firedAtSecAgo, firedFrom);
	const laser = LaserModel.createWithId(laserId, currentLaserCFrame);

	if (firedBy === LOCAL_PLAYER) {
		laser.setColor(new Color3(0, 0, 1));
	} else {
		laser.setColor(LASER_ENEMY_COLOR);
	}

	laser.render();
};

export class LasersController extends ClientController {
	init() {
		LASER_FIRED_INTERNAL.onEvent(onLaserFiredInternal);
		LASER_FIRED_EXTERNAL.onClientEvent(onLaserFiredExternal);
	}
}
