import { TimeModel } from "client/time/TimeModel";
import { TimeService } from "shared/time/TimeService";
import { AckServerFunction } from "shared/RemoteFunctions/AckServerFunction/AckServerFunction";
import { ClientController } from "shared/util/controllers";

const ACK_SERVER_FUNCTION = new AckServerFunction();
const TIME_SERVICE = TimeService.getInstance();

const onHeartbeat = () => {
	const t1 = tick();
	ACK_SERVER_FUNCTION.invokeServer();
	const t2 = tick();
	const pingMs = (t2 - t1) * 1000;
	TIME_SERVICE.registerPingMs(pingMs);
};

export class TimeController extends ClientController {
	init() {
		const time = new TimeModel();
		time.onHeartbeat(onHeartbeat);
	}
}
