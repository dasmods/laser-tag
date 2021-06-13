import { StarterGui } from "@rbxts/services";
import { ClientController } from "shared/util/controllers";

export class GuiController extends ClientController {
	init() {
		StarterGui.SetCoreGuiEnabled(Enum.CoreGuiType.Health, false);
	}
}
