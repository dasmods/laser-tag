import { LaserFiredExternal } from "shared/Events/LaserFiredExternal/LaserFiredExternal";
import { LaserFiredInternal } from "shared/Events/LaserFiredInternal/LaserFiredInternal";
import { ClientController } from "shared/util/controllers";

const LASER_FIRED_INTERNAL = new LaserFiredInternal();
const LASER_FIRED_EXTERNAL = new LaserFiredExternal();

const onLaserFired = () => {
	print("laser fired event received on client");
};

export class LasersController extends ClientController {
	init() {
		LASER_FIRED_INTERNAL.onEvent(onLaserFired);
		LASER_FIRED_EXTERNAL.onClientEvent(onLaserFired);
	}
}
