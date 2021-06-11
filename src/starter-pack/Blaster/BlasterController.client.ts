import { ContextActionService } from "@rbxts/services";
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
	blaster.fire();
};

export class BlasterController {
	static init() {
		const blaster = getBlaster();
		blaster.tool.Equipped.Connect(() => onEquipped(blaster));
		blaster.tool.Unequipped.Connect(() => onUnequipped(blaster));
		blaster.tool.Activated.Connect(() => onActivated(blaster));
	}
}

BlasterController.init();
