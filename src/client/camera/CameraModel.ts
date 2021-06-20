import { Players, RunService, UserInputService, Workspace } from "@rbxts/services";
import { t } from "@rbxts/t";
import { Model } from "shared/util/models";

const LOCAL_PLAYER = Players.LocalPlayer;

export class CameraModel extends Model {
	init() {
		const camera = Workspace.CurrentCamera;
		assert(!t.nil(camera));
	}

	private updateMouseBehavior() {
		UserInputService.MouseBehavior = Enum.MouseBehavior.LockCenter;
	}
}
