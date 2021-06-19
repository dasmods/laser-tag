import { PhysicsService } from "@rbxts/services";
import { t } from "@rbxts/t";

const LASERS = "Lasers";

export class LaserCollisionGroup {
	static cache: LaserCollisionGroup | undefined;

	static getInstance(): LaserCollisionGroup {
		if (t.nil(LaserCollisionGroup.cache)) {
			LaserCollisionGroup.cache = new LaserCollisionGroup();
		}
		return LaserCollisionGroup.cache;
	}

	private constructor() {}

	add(part: BasePart) {
		PhysicsService.SetPartCollisionGroup(part, LASERS);
	}
}
