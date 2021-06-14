import { TimeModel } from "client/time/TimeModel";
import { TimeService } from "shared/time/TimeService";
import { ClientController } from "shared/util/controllers";

const TIME_SERVICE = TimeService.getInstance();

const onHeartbeat = () => {
	TIME_SERVICE.sync();
};

export class TimeController extends ClientController {
	init() {
		const time = new TimeModel();
		time.onHeartbeat(onHeartbeat);
	}
}
