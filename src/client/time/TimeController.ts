import { TimeModel } from "client/time/TimeModel";
import { LatencyService } from "shared/time/LatencyService";
import { AckServerFunction } from "shared/RemoteFunctions/AckServerFunction/AckServerFunction";
import { ClientController } from "shared/util/controllers";

const ACK_SERVER_FUNCTION = new AckServerFunction();
const LATENCY_SERVICE = LatencyService.getInstance();

const onHeartbeat = () => {
	const t1 = tick();
	ACK_SERVER_FUNCTION.invokeServer();
	const t2 = tick();
	const pingSec = t2 - t1;
	LATENCY_SERVICE.registerPingSec(pingSec);
};

export class TimeController extends ClientController {
	init() {
		const time = new TimeModel();
		time.onHeartbeat(onHeartbeat);
	}
}
