import { TimeModel } from "client/time/TimeModel";
import { TimeService } from "shared/time/TimeService";
import { Ack } from "shared/RemoteFunctions/Ack/Ack";
import { ClientController } from "shared/util/controllers";

const ACK = new Ack();
const TIME_SERVICE = TimeService.getInstance();

const onHeartbeat = () => {
	const t1 = tick();
	ACK.invokeServer();
	const t2 = tick();
	const pingSec = t2 - t1;
	TIME_SERVICE.registerPingSec(pingSec);
};

export class TimeController extends ClientController {
	init() {
		const time = new TimeModel();
		time.onHeartbeat(onHeartbeat);
	}
}
