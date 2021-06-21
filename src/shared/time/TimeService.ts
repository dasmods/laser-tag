import { RunService } from "@rbxts/services";
import { t } from "@rbxts/t";
import { Ack } from "shared/RemoteFunctions/Ack/Ack";
import { RUNNING_AVG_SIZE } from "shared/time/TimeConstants";
import { RunningAverage } from "shared/util/RunningAverage";

const ACK = new Ack();
const IS_SERVER = RunService.IsServer();

export class TimeService {
	private static cache: TimeService | undefined;

	static getInstance(): TimeService {
		if (t.nil(TimeService.cache)) {
			TimeService.cache = new TimeService();
		}
		return TimeService.cache;
	}

	private avgPingSec = new RunningAverage(RUNNING_AVG_SIZE);
	private avgOffsetSec = new RunningAverage(RUNNING_AVG_SIZE);

	private constructor() {}

	now() {
		if (IS_SERVER) {
			return tick();
		}
		return tick() - this.getAvgOffsetSec();
	}

	sync() {
		if (IS_SERVER) {
			return;
		}

		const clientTimeSec1 = tick();
		const serverTimeSec = ACK.invokeServer();
		const clientTimeSec2 = tick();

		const pingSec = clientTimeSec2 - clientTimeSec1;
		this.avgPingSec.push(pingSec);

		const timeToReceiveAckSec = pingSec / 2;
		const approximateCurrentServerTimeSec = serverTimeSec + timeToReceiveAckSec;
		const offsetSec = clientTimeSec2 - approximateCurrentServerTimeSec;
		this.avgOffsetSec.push(offsetSec);
	}

	getAvgPingSec() {
		return this.avgPingSec.isDefined() ? this.avgPingSec.get() : 0;
	}

	getAvgOffsetSec() {
		return this.avgOffsetSec.isDefined() ? this.avgOffsetSec.get() : 0;
	}
}
