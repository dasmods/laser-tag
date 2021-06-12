import { t } from "@rbxts/t";
import { LASER_SIZE_X_STUDS, LASER_SIZE_Y_STUDS, LASER_SIZE_Z_STUDS } from "shared/lasers/LasersConstants";

const getTemplatePart = (): Part => {
	const part = script.Parent;
	assert(t.instanceIsA("Part")(part));
	return part;
};

export class LaserTemplate {
	static clone(): Part {
		const laser = getTemplatePart().Clone();
		laser.Name = "Laser";
		laser.Size = new Vector3(LASER_SIZE_X_STUDS, LASER_SIZE_Y_STUDS, LASER_SIZE_Z_STUDS);
		return laser;
	}
}
