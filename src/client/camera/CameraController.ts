import { CameraModel } from "client/camera/CameraModel";
import { ClientController } from "shared/util/controllers";

export class CameraController extends ClientController {
	init() {
		const camera = new CameraModel();
		camera.init();
	}
}
