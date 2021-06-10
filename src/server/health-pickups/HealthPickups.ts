import { Workspace } from "@rbxts/services";
import { HealthPickupModel } from "server/health-pickups/HealthPickupModel";

export const getAllHealthPickups = (): HealthPickupModel[] => {
	const healthPickupsFolder = Workspace.FindFirstChild("HealthPickups");
	if (!healthPickupsFolder) {
		error("could not find the Workspace.HealthPickups folder");
	}
	if (!healthPickupsFolder.IsA("Folder")) {
		error("Workspace.HealthPickups is not a Folder");
	}
	const healthPickups = healthPickupsFolder.GetChildren();
	if (healthPickups.some((healthPickup) => !healthPickup.IsA("BasePart"))) {
		error("found non BasePart in HealthPickups folder");
	}

	return (healthPickups as BasePart[]).map((basePart) => new HealthPickupModel(basePart));
};
