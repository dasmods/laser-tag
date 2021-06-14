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

	private pingsMs: CircularArray<number> = new CircularArray(60);

	private constructor() {}

	registerPingMs(pingMs: number) {
		this.pingsMs.push(pingMs);
	}

	getRunningAveragePingMs(): number {
		const numPings = this.pingsMs.getLength();
		if (numPings === 0) {
			return 0;
		}
		const totalPing = this.pingsMs.getValues().reduce((totalPing, ping) => totalPing + ping, 0);
		return totalPing / numPings;
	}
}
