import { t } from "@rbxts/t";

const getTemplatePart = (): Part => {
	const part = script.Parent;
	assert(t.instanceIsA("Part")(part));
	return part;
};

export class LaserTemplate {
	static clone(): Part {
		const laser = getTemplatePart().Clone();
		laser.Name = "Laser";
		return laser;
	}
}
