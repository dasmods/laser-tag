import { RunService } from "@rbxts/services";
import { t } from "@rbxts/t";
import { Ack } from "shared/RemoteFunctions/Ack/Ack";
import { RUNNING_AVG_SIZE } from "shared/time/TimeConstants";
import { CircularArray } from "shared/util/CircularArray";
import { avg } from "shared/util/math";

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

	private pingsSec: CircularArray<number> = new CircularArray(RUNNING_AVG_SIZE);
	private offsetsSec: CircularArray<number> = new CircularArray(RUNNING_AVG_SIZE);

	private constructor() {}

	now() {
		if (IS_SERVER) {
			return tick();
		}
		return tick() + this.getAvgOffsetSec();
	}

	sync() {
		if (IS_SERVER) {
			return;
		}

		const clientTimeSec1 = this.now();
		const serverTimeSec = ACK.invokeServer();
		const clientTimeSec2 = this.now();

		const pingSec = clientTimeSec2 - clientTimeSec1;
		this.pingsSec.push(pingSec);

		const offsetSec = clientTimeSec1 - serverTimeSec;
		this.offsetsSec.push(offsetSec);
	}

	getAvgPingSec() {
		const numPings = this.pingsSec.getLength();
		if (numPings === 0) {
			return 0;
		}
		return avg(this.pingsSec.getValues());
	}

	getAvgOffsetSec() {
		const numOffsets = this.offsetsSec.getLength();
		if (numOffsets === 0) {
			return 0;
		}
		return avg(this.offsetsSec.getValues());
	}
}
