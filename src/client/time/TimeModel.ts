import { RunService } from "@rbxts/services";

type HeartbeatCallback = (stepSec: number) => void;

export class TimeModel {
	onHeartbeat(callback: HeartbeatCallback) {
		RunService.Heartbeat.Connect(callback);
	}
}
