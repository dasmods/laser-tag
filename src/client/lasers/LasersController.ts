import { Players } from "@rbxts/services";
import { LaserFiredExternal } from "shared/Events/LaserFiredExternal/LaserFiredExternal";
import { LaserFiredInternal } from "shared/Events/LaserFiredInternal/LaserFiredInternal";
import { LaserModel } from "shared/lasers/LaserModel";
import { LASER_ENEMY_COLOR, LASER_FRIENDLY_COLOR, LASER_SPEED_STUDS_PER_SEC } from "shared/lasers/LasersConstants";
import { ClientController } from "shared/util/controllers";

const LASER_FIRED_INTERNAL = new LaserFiredInternal();
const LASER_FIRED_EXTERNAL = new LaserFiredExternal();
const LOCAL_PLAYER = Players.LocalPlayer;

const approximateLaserCurrentCFrame = (firedAt: number, firedFrom: CFrame): CFrame => {
	const timeFiredAgoSec = tick() - firedAt;
	const offsetDistance = LASER_SPEED_STUDS_PER_SEC * timeFiredAgoSec;
	return firedFrom.ToWorldSpace(new CFrame(0, 0, -offsetDistance));
};

const onLaserFiredInternal = (firedFrom: CFrame) => {
	const laser = LaserModel.create(LOCAL_PLAYER, firedFrom);
	laser.setColor(LASER_FRIENDLY_COLOR);
	laser.render();
};

const onLaserFiredExternal = (firedBy: Player, firedAt: number, firedFrom: CFrame) => {
	if (firedBy === LOCAL_PLAYER) {
		return;
	}
	const currentLaserCFrame = approximateLaserCurrentCFrame(firedAt, firedFrom);
	const laser = LaserModel.create(LOCAL_PLAYER, currentLaserCFrame);
	laser.setColor(LASER_ENEMY_COLOR);
	laser.render();
};

export class LasersController extends ClientController {
	init() {
		LASER_FIRED_INTERNAL.onEvent(onLaserFiredInternal);
		LASER_FIRED_EXTERNAL.onClientEvent(onLaserFiredExternal);
	}
}
