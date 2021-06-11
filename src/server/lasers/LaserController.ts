import { LaserFiredEvent } from "shared/Events/LaserFired/LaserFiredEvent";

export class LaserController {
	static init() {
		LaserFiredEvent.onServerEvent((player: Player) => {
			print(`laser fired by ${player.Name}!`);
		});
	}

	private constructor() {}
}
