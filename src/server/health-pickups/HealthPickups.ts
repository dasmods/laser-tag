import { Workspace } from "@rbxts/services";
import { t } from "@rbxts/t";
import { HealthPickupModel } from "server/health-pickups/HealthPickupModel";

const isFolder = (value: unknown): value is Folder => {
	const checkIsFolder = t.instanceIsA("Folder");
	return checkIsFolder(value);
};

const isBasePartArray = (values: unknown[]): values is BasePart[] => {
	const checkIsBasePart = t.instanceIsA("BasePart");
	for (const value of values) {
		if (!checkIsBasePart(value)) {
			return false;
		}
	}
	return true;
};

export class HealthPickups {
	static getAllHealthPickups(): HealthPickupModel[] {
		const healthPickupsFolder = Workspace.FindFirstChild("HealthPickups");
		assert(isFolder(healthPickupsFolder));

		const healthPickups = healthPickupsFolder.GetChildren();
		assert(isBasePartArray(healthPickups));

		return healthPickups.map((basePart) => new HealthPickupModel(basePart));
	}

	private constructor() {}
}
