import { ContextActionService, Players } from "@rbxts/services";
import { BlasterModel } from "starter-pack/Blaster/BlasterModel";
import { getBlaster } from "starter-pack/Blaster/Blasters";

const RELOAD_ACTION = "RELOAD_ACTION";

const onEquipped = (blaster: BlasterModel) => {
	// TODO(jared) The controllers should not be exposed directly to Roblox APIs.
	// Create a KeyBindingService and use it in this module.
	ContextActionService.BindAction(RELOAD_ACTION, () => blaster.reload(), true, Enum.KeyCode.R);
};

const onUnequipped = (blaster: BlasterModel) => {
	ContextActionService.UnbindAction(RELOAD_ACTION);
};

const onActivated = (blaster: BlasterModel) => {
	blaster.fire();
};

export class BlasterController {
	static init() {
		const blaster = getBlaster();
		blaster.init();
		blaster.onEquipped(onEquipped);
		blaster.onActivated(onActivated);
		blaster.onUnequipped(onUnequipped);
	}
}
