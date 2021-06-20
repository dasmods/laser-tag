import { Players, RunService, UserInputService, Workspace } from "@rbxts/services";
import { t } from "@rbxts/t";
import { CameraFSM, createCameraFSM } from "client/camera/CameraFSM";
import { Model } from "shared/util/models";

const LOCAL_PLAYER = Players.LocalPlayer;
const THIRD_PERSON_CAMERA = "ThirdPersonCamera";
const FREE_MOUSE_CAMERA = "FreeMouseCamera";

export class CameraModel extends Model {
	fsm: CameraFSM | undefined;

	init() {
		this.fsm = createCameraFSM({
			onThirdPersonEnter: () => {
				this.onThirdPersonEnter();
			},
			onThirdPersonExit: () => {
				this.onThirdPersonExit();
			},
			onFreeMouseEnter: () => {},
			onFreeMouseExit: () => {},
		});

		this.fsm.dispatch({ type: "changeState", to: "thirdPerson" });
	}

	private getCamera(): Camera {
		const camera = Workspace.CurrentCamera;
		assert(!t.nil(camera));
		return camera;
	}

	private onThirdPersonEnter() {
		RunService.BindToRenderStep(THIRD_PERSON_CAMERA, Enum.RenderPriority.Last.Value + 1, () => {
			this.lockMousePosition();
		});
	}

	private onThirdPersonExit() {
		RunService.UnbindFromRenderStep(THIRD_PERSON_CAMERA);
	}

	private onFreeMouseEnter() {}

	private lockMousePosition() {
		UserInputService.MouseBehavior = Enum.MouseBehavior.LockCenter;
	}
}
