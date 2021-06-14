import { RunService } from "@rbxts/services";
import { t } from "@rbxts/t";
import { Ack } from "shared/RemoteFunctions/Ack/Ack";
import { CircularArray } from "shared/util/CircularArray";
import { avg } from "shared/util/math";

const ACK = new Ack();
const IS_SERVER = RunService.IsServer();

export class TimeService {
	static cache: TimeService | undefined;

	static getInstance(): TimeService {
		if (t.nil(TimeService.cache)) {
			TimeService.cache = new TimeService();
		}
		return TimeService.cache;
	}

	private pingsSec: CircularArray<number> = new CircularArray(100);
	private offsetsSec: CircularArray<number> = new CircularArray(100);

	private constructor() {}

	now() {
		if (IS_SERVER) {
			return tick();
		}
		const pingSec = this.getAvgPingSec();
		const offsetSec = this.getAvgOffsetSec();
		return tick() - pingSec + offsetSec;
	}

	sync() {
		if (IS_SERVER) {
			return;
		}

		const clientTimeSec1 = tick();
		const serverTimeSec = ACK.invokeServer();
		const clientTimeSec2 = tick();

		const pingSec = clientTimeSec2 - clientTimeSec1;
		const offsetSec = clientTimeSec1 - serverTimeSec;

		this.pingsSec.push(pingSec);
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
