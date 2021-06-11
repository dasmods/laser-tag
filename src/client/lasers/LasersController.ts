import { LaserFiredEvent } from "shared/Events/LaserFired/LaserFiredEvent";
import { ClientController } from "shared/util/controllers";

const onLaserFired = () => {
	print("laser fired event received on client");
};

export class LasersController extends ClientController {
	init() {
		LaserFiredEvent.onClientEvent(onLaserFired);
	}
}
