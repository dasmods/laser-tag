import { TimeModel } from "client/time/TimeModel";
import { TimeService } from "shared/time/TimeService";
import { AckRemoteFunction } from "shared/RemoteFunctions/Ack/Ack";
import { ClientController } from "shared/util/controllers";

const ACK_REMOTE_FUNC = new AckRemoteFunction();
const TIME_SERVICE = TimeService.getInstance();

const onHeartbeat = () => {
	const t1 = tick();
	ACK_REMOTE_FUNC.invokeServer();
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
