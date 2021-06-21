import { RunService } from "@rbxts/services";
import { TimeService } from "shared/time/TimeService";
import { ClientController } from "shared/util/controllers";

const TIME_SERVICE = TimeService.getInstance();

export class TimeController extends ClientController {
	init() {
		RunService.Heartbeat.Connect(() => {
			TIME_SERVICE.sync();
		});
	}
}
