import { Debris, HttpService, Workspace } from "@rbxts/services";
import { LaserTemplate } from "shared/lasers/LaserTemplate/LaserTemplate";
import { Model } from "shared/util/models";
import { LASER_DAMAGE, LASER_LIFETIME_SEC, LASER_SPEED_STUDS_PER_SEC } from "shared/lasers/LasersConstants";
import { LaserCollisionGroup } from "shared/lasers/LaserCollisionGroup";
import { FireAudio } from "shared/Sounds/Fire/FireAudio";

const LASER_COLLISION_GROUP = LaserCollisionGroup.getInstance();
const FIRE_AUDIO = new FireAudio();

export class LaserModel extends Model {
	static create(firedFrom: CFrame): LaserModel {
		const laserId = HttpService.GenerateGUID(false);
		return LaserModel.createWithId(laserId, firedFrom);
	}

	static createWithId(laserId: string, firedFrom: CFrame) {
		const part = LaserTemplate.clone();
		part.CFrame = firedFrom;
		LASER_COLLISION_GROUP.add(part);

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

	render() {
		this.part.Touched.Connect((otherPart: BasePart) => this.onTouched(otherPart));
		this.part.Parent = Workspace;
		FIRE_AUDIO.playLocal();
		Debris.AddItem(this.part, LASER_LIFETIME_SEC);
	}

	renderAsTracer(firedAtSecAgo: number) {
		this.part.Touched.Connect((otherPart: BasePart) => {
			if (!this.canCollideWith(otherPart)) {
				return;
			}
			const humanoid = this.getHumanoid(otherPart);
			if (humanoid) {
				humanoid.TakeDamage(LASER_DAMAGE);
			}
			this.part.Destroy();
		});
		this.setColor(new Color3(1, 1, 0));
		this.part.Parent = Workspace;
		Debris.AddItem(this.part, LASER_LIFETIME_SEC - firedAtSecAgo);
	}

	getLaserId() {
		return this.laserId;
	}

	setColor(color: Color3) {
		this.part.Color = color;
	}

	private onTouched(otherPart: BasePart) {
		if (otherPart.IsDescendantOf(Workspace) && !this.part.CanCollideWith(otherPart)) {
			return;
		}
		// TODO(jared) Render hitbox for the person who fired this.
		this.part.Destroy();
	}

	private canCollideWith(otherPart: BasePart) {
		return otherPart.IsDescendantOf(Workspace) && this.part.CanCollideWith(otherPart);
	}

	private getHumanoid(part: BasePart) {
		const parent = part.Parent;
		const grandparent = parent?.Parent;
		const humanoid = parent?.FindFirstChildWhichIsA("Humanoid") || grandparent?.FindFirstChildWhichIsA("Humanoid");
		return humanoid;
	}
}
