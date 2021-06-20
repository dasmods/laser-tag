import { ContextActionService, Players, RunService, UserInputService, Workspace } from "@rbxts/services";
import { t } from "@rbxts/t";
import { CAMERA_TARGET_HEIGHT_OFFSET_STUDS, CAMERA_ZOOM_DISTANCE } from "client/camera/CameraConstants";
import { CameraFSM, createCameraFSM } from "client/camera/CameraFSM";
import { Model } from "shared/util/models";

const LOCK_MOUSE = "LockMouse";
const LOCK_THIRD_PERSON_CAMERA = "LockCameraZoom";
const ACTIVATE_FREE_LOOK_CAMERA = "ActivateFreeLook";

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
			ACTIVATE_FREE_LOOK_CAMERA,
			(actionName, inputState) => {
				this.onActivateFreeMouseCamera(actionName, inputState);
			},
			false,
			Enum.KeyCode.C,
		);

		this.fsm.dispatch({ type: "changeState", to: "thirdPerson" });
	}

	private onActivateFreeMouseCamera(actionName: string, inputState: Enum.UserInputState) {
		if (actionName !== ACTIVATE_FREE_LOOK_CAMERA) {
			return;
		}
		if (inputState !== Enum.UserInputState.Begin) {
			return;
		}

		const fsm = this.fsm;
		if (t.nil(fsm)) {
			return;
		}

		const nextState = fsm.getState() === "freeLook" ? "thirdPerson" : "freeLook";
		fsm.dispatch({ type: "changeState", to: nextState });
	}

	private onThirdPersonEnter() {
		RunService.BindToRenderStep(LOCK_THIRD_PERSON_CAMERA, Enum.RenderPriority.Camera.Value + 1, () => {
			Players.LocalPlayer.CameraMinZoomDistance = CAMERA_ZOOM_DISTANCE;
			Players.LocalPlayer.CameraMaxZoomDistance = CAMERA_ZOOM_DISTANCE;

			const camera = Workspace.CurrentCamera;
			if (t.nil(camera)) {
				return;
			}
			camera.CFrame = camera.CFrame.add(new Vector3(0, CAMERA_TARGET_HEIGHT_OFFSET_STUDS, 0));
		});

		RunService.BindToRenderStep(LOCK_MOUSE, Enum.RenderPriority.Last.Value + 1, () => {
			UserInputService.MouseBehavior = Enum.MouseBehavior.LockCenter;
		});
	}

	private onThirdPersonExit() {
		RunService.UnbindFromRenderStep(LOCK_THIRD_PERSON_CAMERA);
		RunService.UnbindFromRenderStep(LOCK_MOUSE);

		// Default values
		Players.LocalPlayer.CameraMinZoomDistance = 0.5;
		Players.LocalPlayer.CameraMaxZoomDistance = 128;
	}
}
