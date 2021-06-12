import { LaserFiredServerToClientEvent } from "shared/Events/LaserFiredRemote/LaserFiredRemote";
import { ClientController } from "shared/util/controllers";

const onLaserFired = () => {
	print("laser fired event received on client");
};

export class LasersController extends ClientController {
	init() {
		LaserFiredServerToClientEvent;
	}
}
