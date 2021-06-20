import { ContextActionService, Players, RunService, UserInputService, Workspace } from "@rbxts/services";
import { t } from "@rbxts/t";
import { CameraFSM, createCameraFSM } from "client/camera/CameraFSM";
import { Model } from "shared/util/models";

const LOCAL_PLAYER = Players.LocalPlayer;
const THIRD_PERSON_CAMERA = "ThirdPersonCamera";
const ACTIVATE_FREE_MOUSE_CAMERA = "ActivateFreeLook";

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
		});

		ContextActionService.BindAction(
			ACTIVATE_FREE_MOUSE_CAMERA,
			(actionName, inputState) => {
				this.onActivateFreeLookCameraAction(actionName, inputState);
			},
			false,
			Enum.KeyCode.LeftAlt,
		);

		this.fsm.dispatch({ type: "changeState", to: "thirdPerson" });
	}

	private getCamera(): Camera {
		const camera = Workspace.CurrentCamera;
		assert(!t.nil(camera));
		return camera;
	}

	private onActivateFreeLookCameraAction(actionName: string, inputState: Enum.UserInputState) {
		if (actionName !== ACTIVATE_FREE_MOUSE_CAMERA) {
			return;
		}

		const fsm = this.fsm;
		if (t.nil(fsm)) {
			return;
		}

		switch (inputState) {
			case Enum.UserInputState.Begin:
				fsm.dispatch({ type: "changeState", to: "freeLook" });
				break;
			case Enum.UserInputState.End:
				fsm.dispatch({ type: "changeState", to: "thirdPerson" });
				break;
		}
	}

	private onThirdPersonEnter() {
		RunService.BindToRenderStep(THIRD_PERSON_CAMERA, Enum.RenderPriority.Last.Value + 1, () => {
			this.lockMousePositionToCenter();
		});
	}

	private onThirdPersonExit() {
		RunService.UnbindFromRenderStep(THIRD_PERSON_CAMERA);
	}

	private lockMousePositionToCenter() {
		UserInputService.MouseBehavior = Enum.MouseBehavior.LockCenter;
	}
}
