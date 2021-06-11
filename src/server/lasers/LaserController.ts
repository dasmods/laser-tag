import { LaserFired } from "shared/Events/LaserFired/LaserFired";

export class LaserController {
	static init() {
		LaserFired.onServerEvent((player: Player) => {
			print(`laser fired by ${player.Name}!`);
		});
	}

	private constructor() {}
}
