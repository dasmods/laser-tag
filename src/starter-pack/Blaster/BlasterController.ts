import { ContextActionService } from "@rbxts/services";
import { PrimeAudio } from "shared/Sounds/Prime/PrimeAudio";
import { BlasterModel } from "starter-pack/Blaster/BlasterModel";
import { getBlaster } from "starter-pack/Blaster/Blasters";

const RELOAD_ACTION = "RELOAD_ACTION";
const PRIME_AUDIO = new PrimeAudio();

const onEquipped = (blaster: BlasterModel) => {
	// TODO(jared) The controllers should not be exposed directly to Roblox APIs.
	// Create a KeyBindingService and use it in this module.
	PRIME_AUDIO.playLocal();
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
		blaster.onEquipped(onEquipped);
		blaster.onActivated(onActivated);
		blaster.onUnequipped(onUnequipped);
	}
}
