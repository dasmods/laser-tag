import { Debris, Workspace } from "@rbxts/services";
import { LaserTemplate } from "shared/lasers/LaserTemplate/LaserTemplate";
import { Model } from "shared/util/models";
import { LASER_SPEED_STUDS_PER_SEC } from "shared/lasers/LasersConstants";

export class LaserModel extends Model {
	static create(firedByPlayer: Player, initialCFrame: CFrame): LaserModel {
		const part = LaserTemplate.clone();
		part.CFrame = initialCFrame;

		const bodyVelocity = new Instance("BodyVelocity");
		bodyVelocity.Velocity = initialCFrame.LookVector.mul(LASER_SPEED_STUDS_PER_SEC);
		bodyVelocity.Parent = part;

		return new LaserModel(firedByPlayer, part);
	}

	private firedByPlayer: Player;
	private part: Part;

	private constructor(firedByPlayer: Player, part: Part) {
		super();
		this.firedByPlayer = firedByPlayer;
		this.part = part;
	}

	init() {}

	render() {
		this.part.Touched.Connect((otherPart: BasePart) => this.onTouched(otherPart));
		this.part.Parent = Workspace;
		Debris.AddItem(this.part, 10);
	}

	setColor(color: Color3) {
		this.part.Color = color;
	}

	private onTouched(otherPart: BasePart) {
		if (!otherPart.CanCollide) {
			return;
		}

		this.part.Destroy();
	}
}
