import { Debris, Workspace } from "@rbxts/services";
import { LaserTemplate } from "shared/lasers/LaserTemplate/LaserTemplate";
import { Model } from "shared/util/models";
import { LASER_SPEED_STUDS_PER_SEC } from "shared/lasers/LasersConstants";

export class LaserModel extends Model {
	static create(initialVelocity: CFrame): LaserModel {
		const part = LaserTemplate.clone();
		part.CFrame = initialVelocity;

		const bodyVelocity = new Instance("BodyVelocity");
		bodyVelocity.Velocity = initialVelocity.LookVector.mul(LASER_SPEED_STUDS_PER_SEC);
		bodyVelocity.Parent = part;

		return new LaserModel(part);
	}

	private part: Part;

	private constructor(part: Part) {
		super();
		this.part = part;
	}

	init() {}

	render() {
		this.part.Parent = Workspace;
		Debris.AddItem(this.part);
	}
}
