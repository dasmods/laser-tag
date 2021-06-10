import { Events } from "shared/Events";

export class LaserController {
	static init() {
		Events.LaserFired.OnServerEvent.Connect((player: Player, position: unknown) => {});
	}

	private constructor() {}
}
