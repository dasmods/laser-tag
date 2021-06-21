import { HttpService } from "@rbxts/services";
import { t } from "@rbxts/t";
import {
	DEFAULT_PING_SEC,
	IN_FLIGHT_PING_TTL_SEC,
	PING_RUNNING_AVG_SIZE,
} from "server/ping-tracker/PingTrackerConstants";
import { TimeService } from "shared/time/TimeService";
import { RunningAverage } from "shared/util/RunningAverage";
import { TTLStore } from "shared/util/TTLStore";

type Ping = {
	pingId: string;
	createdAt: number;
	userId: number;
};

const TIME_SERVICE = TimeService.getInstance();

export class PingTrackerService {
	private static cache: PingTrackerService | undefined;

	static getInstance(): PingTrackerService {
		if (t.nil(PingTrackerService.cache)) {
			PingTrackerService.cache = new PingTrackerService();
		}
		return PingTrackerService.cache;
	}

	private pingsByPingId = new TTLStore<Ping>(IN_FLIGHT_PING_TTL_SEC);
	private avgPingSecByUserId: Record<number, RunningAverage> = {};

	private constructor() {}

	getAvgPingSec(player: Player): number {
		const avgPingSec = this.avgPingSecByUserId[player.UserId];
		if (t.nil(avgPingSec) || !avgPingSec.isDefined()) {
			return DEFAULT_PING_SEC;
		}
		return avgPingSec.get();
	}

	sendPing(player: Player) {
		const ping = this.generatePing(player);
	}

	receivePing(pingId: string, player: Player) {
		const now = TIME_SERVICE.now();

		const ping = this.pingsByPingId.get(pingId);
		if (t.nil(ping)) {
			return;
		}
		this.pingsByPingId.remove(pingId);

		let avgPingSec = this.avgPingSecByUserId[player.UserId];
		if (t.nil(ping)) {
			avgPingSec = new RunningAverage(PING_RUNNING_AVG_SIZE);
			this.avgPingSecByUserId[player.UserId] = avgPingSec;
		}

		const pingSec = now - ping.createdAt;
		avgPingSec.push(pingSec);
	}

	private generatePing(player: Player): Ping {
		const createdAt = TIME_SERVICE.now();
		const pingId = HttpService.GenerateGUID(false);
		const userId = player.UserId;
		const ping = { pingId, createdAt, userId };

		this.pingsByPingId.set(pingId, ping);

		return ping;
	}
}
