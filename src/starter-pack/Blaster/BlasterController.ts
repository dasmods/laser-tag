import { ContextActionService, Players } from "@rbxts/services";
import { BlasterConstants } from "starter-pack/Blaster/BlasterConstants";
import { BlasterModel } from "starter-pack/Blaster/BlasterModel";
import { getBlaster } from "starter-pack/Blaster/Blasters";

const onEquipped = (blaster: BlasterModel) => {
	ContextActionService.BindAction(BlasterConstants.RELOAD_ACTION, () => blaster.reload(), true, Enum.KeyCode.R);
};

const onUnequipped = (blaster: BlasterModel) => {
	ContextActionService.UnbindAction(BlasterConstants.RELOAD_ACTION);
};

const onActivated = (blaster: BlasterModel) => {
	const position = blaster.getPosition();
	blaster.fire(position);
};

export class BlasterController {
	static init() {
		const blaster = getBlaster();
		blaster.onEquipped(onEquipped);
		blaster.onActivated(onActivated);
		blaster.onUnequipped(onUnequipped);
	}
}
