import { TimeModel } from "client/time/TimeModel";
import { LatencyService } from "shared/time/LatencyService";
import { Ack } from "shared/RemoteFunctions/Ack/Ack";
import { ClientController } from "shared/util/controllers";

const ACK = new Ack();
const LATENCY_SERVICE = LatencyService.getInstance();

const onHeartbeat = () => {
	const t1 = tick();
	ACK.invokeServer();
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
