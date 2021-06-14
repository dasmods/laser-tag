import { t } from "@rbxts/t";
import { CircularArray } from "shared/util/CircularArray";

export class TimeService {
	static cache: TimeService | undefined;

	static getInstance(): TimeService {
		if (t.nil(TimeService.cache)) {
			TimeService.cache = new TimeService();
		}
		return TimeService.cache;
	}

	private pingsSec: CircularArray<number> = new CircularArray(60);

	private constructor() {}

	registerPingSec(pingSec: number) {
		this.pingsSec.push(pingSec);
	}

	getRunningAveragePingSec(): number {
		const numPings = this.pingsSec.getLength();
		if (numPings === 0) {
			return 0;
		}
		const totalPing = this.pingsSec.getValues().reduce((totalPing, ping) => totalPing + ping, 0);
		return totalPing / numPings;
	}
}
