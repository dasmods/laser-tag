import { Players, RunService } from "@rbxts/services";
import { PingTracker } from "server/ping/PingTracker";
import { Ping } from "shared/Events/Ping/Ping";
import { ServerController } from "shared/util/controllers";

const PING = new Ping();
const PING_TRACKER = PingTracker.getInstance();

export class PingController extends ServerController {
	init() {
		PING.onServerEvent((player, pingId) => {
			PING_TRACKER.receivePing(player, pingId);
		});

		Players.PlayerAdded.Connect((player) => {
			PING_TRACKER.track(player);
		});

		Players.PlayerRemoving.Connect((player) => {
			PING_TRACKER.untrack(player);
		});

		RunService.Heartbeat.Connect(() => {
			PING_TRACKER.sendPingsToTrackedPlayers();
		});
	}
}
