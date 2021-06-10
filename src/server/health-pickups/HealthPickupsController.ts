import { HealthPickupModel } from "server/health-pickups/HealthPickupModel";
import { HealthPickups } from "server/health-pickups/HealthPickups";

const getHumanoid = (part: BasePart) => {
	return part.Parent?.FindFirstChildWhichIsA("Humanoid");
};

const onTouched = (otherPart: BasePart, healthPickup: HealthPickupModel) => {
	const humanoid = getHumanoid(otherPart);
	if (!humanoid) {
		return;
	}

	healthPickup.heal(humanoid);
};

export class HealthPickupsController {
	static init() {
		for (const healthPickup of HealthPickups.getAllHealthPickups()) {
			healthPickup.init();
			healthPickup.addTouchedEventListener(onTouched);
		}
	}

	private constructor() {}
}
