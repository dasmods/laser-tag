import { Debris, HttpService, Players, Workspace } from "@rbxts/services";
import { LaserTemplate } from "shared/lasers/LaserTemplate/LaserTemplate";
import { Model } from "shared/util/models";
import { LASER_LIFETIME_SEC, LASER_SPEED_STUDS_PER_SEC } from "shared/lasers/LasersConstants";
import { LaserHitExternal } from "shared/Events/LaserHitExternal/LaserHitExternal";
import { t } from "@rbxts/t";

const LASER_HIT_EXTERNAL = new LaserHitExternal();
export class LaserModel extends Model {
	static create(firedBy: Player, firedFrom: CFrame): LaserModel {
		const laserId = HttpService.GenerateGUID(false);
		return LaserModel.createWithId(laserId, firedBy, firedFrom);
	}

	static createWithId(laserId: string, firedBy: Player, firedFrom: CFrame) {
		const part = LaserTemplate.clone();
		part.CFrame = firedFrom;

		const bodyVelocity = new Instance("BodyVelocity");
		bodyVelocity.Velocity = firedFrom.LookVector.mul(LASER_SPEED_STUDS_PER_SEC);
		bodyVelocity.Parent = part;

		return new LaserModel(laserId, firedBy, part);
	}

	private laserId: string;
	private firedBy: Player;
	private part: Part;

	private constructor(laserId: string, firedBy: Player, part: Part) {
		super();
		this.laserId = laserId;
		this.firedBy = firedBy;
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
