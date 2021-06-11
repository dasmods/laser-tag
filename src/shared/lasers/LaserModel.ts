import { Workspace } from "@rbxts/services";
import { Model } from "shared/util/models";

export class LaserModel extends Model {
	static create(position: Vector3): LaserModel {
		const part = new Instance("Part");
		part.Size = new Vector3(0.2, 0.2, 400);
		part.Anchored = true;
		part.CanCollide = false;
		part.Color = Color3.fromRGB(255, 0, 0);
		part.Material = Enum.Material.Neon;
		part.Parent = Workspace;

		return new LaserModel(part);
	}

	private part: Part;

	constructor(part: Part) {
		super();
		this.part = part;
	}

	init() {}
}
