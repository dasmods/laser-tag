import { Debris, Workspace } from "@rbxts/services";
import { Model } from "shared/util/models";

export class LaserModel extends Model {
	static create(initialVelocity: CFrame): LaserModel {
		const part = new Instance("Part");
		part.Name = "Laser";
		part.CFrame = initialVelocity;
		part.Size = new Vector3(0.2, 0.2, 100);
		part.Anchored = true;
		part.CanCollide = false;
		part.Color = Color3.fromRGB(255, 0, 0);
		part.Material = Enum.Material.Neon;
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
