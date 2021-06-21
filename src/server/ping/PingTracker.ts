import { HttpService } from "@rbxts/services";
import { t } from "@rbxts/t";
import {
	DEFAULT_PING_SEC,
	PING_TTL_SEC,
	PING_RUNNING_AVG_SIZE,
	MAX_NUM_PINGS_IN_FLIGHT,
} from "server/ping/PingConstants";
import { Ping as PingExternalEvent } from "shared/Events/Ping/Ping";
import { TimeService } from "shared/time/TimeService";
import { RunningAverage } from "shared/util/RunningAverage";
import { TTLStore } from "shared/util/TTLStore";

type Ping = {
	pingId: string;
	createdAt: number;
	userId: number;
};

const TIME_SERVICE = TimeService.getInstance();
const PING = new PingExternalEvent();

export class PingTracker {
	private static cache: PingTracker | undefined;

	static getInstance(): PingTracker {
		if (t.nil(PingTracker.cache)) {
			PingTracker.cache = new PingTracker();
		}
		return PingTracker.cache;
	}

	private pingsByPingId = new TTLStore<Ping>(PING_TTL_SEC);
	private pingsByUserId: Record<number, TTLStore<Ping> | undefined> = {};
	private avgPingSecByUserId: Record<number, RunningAverage | undefined> = {};
	private trackedPlayers = new Set<Player>();

	private constructor() {}

	track(player: Player) {
		this.trackedPlayers.add(player);
		this.avgPingSecByUserId[player.UserId] = new RunningAverage(PING_RUNNING_AVG_SIZE);
		this.pingsByUserId[player.UserId] = new TTLStore<Ping>(PING_TTL_SEC);
	}

	untrack(player: Player) {
		this.trackedPlayers.delete(player);
		this.avgPingSecByUserId[player.UserId] = undefined;
		this.pingsByUserId[player.UserId] = undefined;
	}

	getAvgPingSec(player: Player): number {
		const avgPingSec = this.avgPingSecByUserId[player.UserId];
		if (t.nil(avgPingSec) || !avgPingSec.isDefined()) {
			return DEFAULT_PING_SEC;
		}
		return avgPingSec.get();
	}

	sendPingsToTrackedPlayers() {
		for (const player of this.trackedPlayers) {
			const numPingsInFlight = this.getNumPingsInFlight(player);
			if (numPingsInFlight < MAX_NUM_PINGS_IN_FLIGHT) {
				this.sendPing(player);
			}
		}
	}

	receivePing(player: Player, pingId: string) {
		const now = TIME_SERVICE.now();

		const ping = this.pingsByPingId.get(pingId);
		if (t.nil(ping)) {
			return;
		}
		if (ping.userId !== player.UserId) {
			return;
		}
		this.unregisterPing(ping);

		let avgPingSec = this.avgPingSecByUserId[player.UserId];
		if (t.nil(ping)) {
			avgPingSec = new RunningAverage(PING_RUNNING_AVG_SIZE);
			this.avgPingSecByUserId[player.UserId] = avgPingSec;
		}
		assert(!t.nil(avgPingSec));

		const pingSec = now - ping.createdAt;
		avgPingSec.push(pingSec);
	}

	private sendPing(player: Player) {
		const createdAt = TIME_SERVICE.now();
		const pingId = HttpService.GenerateGUID(false);
		const userId = player.UserId;
		const ping = { pingId, createdAt, userId };

		this.registerPing(ping);

		PING.dispatchToClient(player, pingId);
	}

	private registerPing(ping: Ping) {
		if (t.nil(this.pingsByUserId[ping.userId])) {
			this.pingsByUserId[ping.userId] = new TTLStore<Ping>(PING_TTL_SEC);
		}
		const userPings = this.pingsByUserId[ping.userId];
		assert(!t.nil(userPings));

		userPings.set(ping.pingId, ping);
		this.pingsByPingId.set(ping.pingId, ping);
	}

	private unregisterPing(ping: Ping) {
		const userPings = this.pingsByUserId[ping.userId];
		if (!t.nil(userPings)) {
			userPings.remove(ping.pingId);
		}
		this.pingsByPingId.remove(ping.pingId);
	}

	private getNumPingsInFlight(player: Player): number {
		const userPings = this.pingsByUserId[player.UserId];
		if (t.nil(userPings)) {
			return 0;
		}
		return userPings.getSize();
	}
}
