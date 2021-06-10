import { HealthPickupModel } from "server/health-pickups/HealthPickupModel";
import * as HealthPickups from "server/health-pickups/HealthPickups";

const getHumanoid = (part: BasePart) => {
	return part.Parent?.FindFirstChildWhichIsA("Humanoid");
};

const onTouched = (otherPart: BasePart, healthPickup: HealthPickupModel) => {
	if (!healthPickup.isEnabled()) {
		return;
	}

	const humanoid = getHumanoid(otherPart);
	if (!humanoid) {
		return;
	}

	healthPickup.heal(humanoid);
	healthPickup.cooldown();
};

export class HealthPickupsController {
	static init() {
		print("Initializing HealthPickupsController");
		for (const healthPickup of HealthPickups.getAllHealthPickups()) {
			healthPickup.init();
			healthPickup.addTouchedEventListener(onTouched);
		}
	}
}
