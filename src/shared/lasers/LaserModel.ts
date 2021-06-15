import { Debris, HttpService, Workspace } from "@rbxts/services";
import { LaserTemplate } from "shared/lasers/LaserTemplate/LaserTemplate";
import { Model } from "shared/util/models";
import { LASER_LIFETIME_SEC, LASER_SPEED_STUDS_PER_SEC } from "shared/lasers/LasersConstants";
import { LaserHitExternal } from "shared/Events/LaserHitExternal/LaserHitExternal";

const LASER_HIT_EXTERNAL = new LaserHitExternal();

export class LaserModel extends Model {
	static create(firedFrom: CFrame): LaserModel {
		const laserId = HttpService.GenerateGUID(false);
		return LaserModel.createWithId(laserId, firedFrom);
	}

	static createWithId(laserId: string, firedFrom: CFrame) {
		const part = LaserTemplate.clone();
		part.CFrame = firedFrom;

		const bodyVelocity = new Instance("BodyVelocity");
		bodyVelocity.Velocity = firedFrom.LookVector.mul(LASER_SPEED_STUDS_PER_SEC);
		bodyVelocity.Parent = part;

		return new LaserModel(laserId, part);
	}

	private laserId: string;
	private part: Part;

	private constructor(laserId: string, part: Part) {
		super();
		this.laserId = laserId;
		this.part = part;
	}

	init() {}

	render() {
		this.part.Touched.Connect((otherPart: BasePart) => this.onTouched(otherPart));
		this.part.Parent = Workspace;
		Debris.AddItem(this.part, LASER_LIFETIME_SEC);
	}

	getLaserId() {
		return this.laserId;
	}

	setColor(color: Color3) {
		this.part.Color = color;
	}

	private onTouched(otherPart: BasePart) {
		if (!otherPart.CanCollide) {
			return;
		}
		LASER_HIT_EXTERNAL.dispatchToServer(this.laserId);
		this.part.Destroy();
	}
}
