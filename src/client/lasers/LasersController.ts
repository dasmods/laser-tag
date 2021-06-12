import { Players } from "@rbxts/services";
import { LaserFiredExternal } from "shared/Events/LaserFiredExternal/LaserFiredExternal";
import { LaserFiredInternal } from "shared/Events/LaserFiredInternal/LaserFiredInternal";
import { LaserModel } from "shared/lasers/LaserModel";
import { ClientController } from "shared/util/controllers";

const LASER_FIRED_INTERNAL = new LaserFiredInternal();
const LASER_FIRED_EXTERNAL = new LaserFiredExternal();

const onLaserFiredInternal = (initialVelocity: CFrame) => {
	const laser = LaserModel.create(initialVelocity);
	laser.render();
};

const onLaserFiredExternal = (firedByPlayer: Player, initialVelocity: CFrame) => {
	if (firedByPlayer === Players.LocalPlayer) {
		return;
	}
	print(`laser fired by ${firedByPlayer}`);
};

export class LasersController extends ClientController {
	init() {
		LASER_FIRED_INTERNAL.onEvent(onLaserFiredInternal);
		LASER_FIRED_EXTERNAL.onClientEvent(onLaserFiredExternal);
	}
}
