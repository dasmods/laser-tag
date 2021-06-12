import { Debris, Workspace } from "@rbxts/services";
import { LaserTemplate } from "shared/lasers/LaserTemplate/LaserTemplate";
import { Model } from "shared/util/models";

export class LaserModel extends Model {
	static create(initialVelocity: CFrame): LaserModel {
		const part = LaserTemplate.clone();
		part.CFrame = initialVelocity;
		return new LaserModel(part);
	}

	private part: Part;

	constructor(part: Part) {
		super();
		this.part = part;
	}

	init() {}

	render() {
		this.part.Parent = Workspace;
		Debris.AddItem(this.part, 3);
	}
}
