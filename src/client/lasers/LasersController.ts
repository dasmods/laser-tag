import { Players } from "@rbxts/services";
import { LaserFiredExternal } from "shared/Events/LaserFiredExternal/LaserFiredExternal";
import { LaserFiredInternal } from "shared/Events/LaserFiredInternal/LaserFiredInternal";
import { LaserModel } from "shared/lasers/LaserModel";
import { ClientController } from "shared/util/controllers";

const LASER_FIRED_INTERNAL = new LaserFiredInternal();
const LASER_FIRED_EXTERNAL = new LaserFiredExternal();
const LOCAL_PLAYER = Players.LocalPlayer;

const onLaserFiredInternal = (initialCFrame: CFrame) => {
	const laser = LaserModel.create(LOCAL_PLAYER, initialCFrame);
	laser.render();
};

const onLaserFiredExternal = (firedByPlayer: Player, initialCFrame: CFrame) => {
	if (firedByPlayer === LOCAL_PLAYER) {
		return;
	}
	const laser = LaserModel.create(LOCAL_PLAYER, initialCFrame);
	laser.render();
};

export class LasersController extends ClientController {
	init() {
		LASER_FIRED_INTERNAL.onEvent(onLaserFiredInternal);
		LASER_FIRED_EXTERNAL.onClientEvent(onLaserFiredExternal);
	}
}
