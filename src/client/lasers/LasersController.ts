import { LaserFiredLocalEvent } from "shared/Events/LaserFiredLocal/LaserFiredLocalEvent";
import { LaserFiredRemoteEvent } from "shared/Events/LaserFiredRemote/LaserFiredRemoteEvent";
import { ClientController } from "shared/util/controllers";

const onLaserFired = () => {
	print("laser fired event received on client");
};

export class LasersController extends ClientController {
	init() {
		LaserFiredLocalEvent.onClientEvent(onLaserFired);
		LaserFiredRemoteEvent.onClientEvent(onLaserFired);
	}
}
