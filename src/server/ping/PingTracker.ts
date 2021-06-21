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

type PingStore = { [userId: number]: TTLStore<Ping> | undefined };
type AvgPingSecStore = { [userId: number]: RunningAverage | undefined };

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

	private pings: PingStore = {};
	private avgs: AvgPingSecStore = {};
	private trackedPlayers = new Set<Player>();

	private constructor() {}

	track(player: Player) {
		this.trackedPlayers.add(player);
		this.avgs[player.UserId] = new RunningAverage(PING_RUNNING_AVG_SIZE);
		this.pings[player.UserId] = new TTLStore<Ping>(PING_TTL_SEC);
	}

	untrack(player: Player) {
		this.trackedPlayers.delete(player);
		this.avgs[player.UserId] = undefined;
		this.pings[player.UserId] = undefined;
	}

	getAvgPingSec(player: Player): number {
		const avgPingSec = this.avgs[player.UserId];
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
		const receivedAt = TIME_SERVICE.now();

		const ping = this.pings[player.UserId]?.get(pingId);
		if (t.nil(ping)) {
			return;
		}

		this.unregisterPing(ping);

		this.updateAvgSec(ping, receivedAt);
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
		this.pings[ping.userId]?.set(ping.pingId, ping);
	}

	private unregisterPing(ping: Ping) {
		this.pings[ping.userId]?.remove(ping.pingId);
	}

	private updateAvgSec(ping: Ping, receivedAt: number) {
		this.avgs[ping.userId]?.push(receivedAt - ping.createdAt);
	}

	private getNumPingsInFlight(player: Player): number {
		const numPingsInFlight = this.pings[player.UserId]?.getSize();
		return t.number(numPingsInFlight) ? numPingsInFlight : 0;
	}
}
