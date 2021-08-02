import { Players, UserInputService, Workspace } from "@rbxts/services";
import { t } from "@rbxts/t";
import { LaserFiredInternal } from "shared/Events/LaserFiredInternal/LaserFiredInternal";
import { LASER_MAX_AIM_DISTANCE_STUDS } from "shared/lasers/LasersConstants";
import { PrimeAudio } from "shared/Sounds/Prime/PrimeAudio";
import { Model } from "shared/util/models";
import {
	DEFAULT_TOOL_TEXTURE,
	EMPTY_TOOL_TEXTURE,
	FIRE_RATE_HZ,
	MAX_AMMO,
	RELOADING_TOOL_TEXTURE,
	RELOAD_TIME_SEC,
} from "starter-pack/Blaster/BlasterConstants";
import { BlasterFSM, createBlasterFSM } from "starter-pack/Blaster/BlasterFSM";

type Callback = (blaster: BlasterModel) => void;

const LASER_FIRED_INTERNAL = new LaserFiredInternal();
const LOCAL_PLAYER = Players.LocalPlayer;
const PRIME_AUDIO = new PrimeAudio();

export class BlasterModel extends Model {
	private tool: Tool;
	private handle: MeshPart;

	private ammo = MAX_AMMO;
	private fsm: BlasterFSM;

	constructor(tool: Tool, handle: MeshPart) {
		super();
		this.tool = tool;
		this.handle = handle;

		this.fsm = createBlasterFSM({
			fire: async () => {
				await this.doFire();
			},
			reload: async () => {
				await this.doReload();
			},
			hasAmmo: () => this.ammo > 0,
			onEmpty: () => this.onEmpty(),
		});
	}

	onActivated(callback: Callback) {
		this.tool.Activated.Connect(() => callback(this));
	}

	onEquipped(callback: Callback) {
		this.tool.Equipped.Connect(() => callback(this));
	}

	onUnequipped(callback: Callback) {
		this.tool.Unequipped.Connect(() => callback(this));
	}

	reload() {
		this.fsm.dispatch({ type: "reload" });
	}

	fire() {
		this.fsm.dispatch({ type: "fire" });
	}

	private async doReload() {
		this.tool.TextureId = RELOADING_TOOL_TEXTURE;
		await Promise.delay(RELOAD_TIME_SEC);
		this.ammo = MAX_AMMO;
		this.tool.TextureId = DEFAULT_TOOL_TEXTURE;
		PRIME_AUDIO.playLocal();
	}

	private async doFire() {
		this.ammo--;
		const firedFrom = this.calculateFiredFrom();
		LASER_FIRED_INTERNAL.dispatch(firedFrom);
		await Promise.delay(FIRE_RATE_HZ);
	}

	private calculateFiredFrom(): CFrame {
		const muzzlePosition = this.getMuzzlePosition();
		const crosshairsTargetPosition = this.getCrosshairsTargetPosition();

		// TODO(jared) Remove when done testing.
		this.renderPosition(muzzlePosition);

		// TODO(jared) Look at this: https://devforum.roblox.com/t/how-do-i-create-a-third-person-aim-script/964777

		// TODO(jared) By default, the pivot point is in the MIDDLE of the laser.
		// The problem that this causes is that lookAt will re-orient the laser
		// along that axis, which changes the butt of the laser to not come out
		// of the muzzle.
		//
		// There is a new experiemental pivot API that can change the pivot point.
		// We might need to roll out our own CFrame.lookAt because we cannot change
		// the pivot point of something that doesn't exist.
		//
		// https://devforum.roblox.com/t/pivot-points-studio-beta/1180689

		return CFrame.lookAt(muzzlePosition, crosshairsTargetPosition);
	}

	private getMuzzlePosition(): Vector3 {
		const offsetCFrame = new CFrame(0, 0, -1.75);
		return this.handle.CFrame.ToWorldSpace(offsetCFrame).Position;
	}

	private getCrosshairsTargetPosition(): Vector3 {
		const camera = this.getCamera();

		const crosshairLocation = UserInputService.GetMouseLocation();
		const crosshairRay = camera.ViewportPointToRay(crosshairLocation.X, crosshairLocation.Y);
		const crosshairMaxAimDistanceVector = crosshairRay.Direction.mul(LASER_MAX_AIM_DISTANCE_STUDS);
		const crosshairRaycastResult = Workspace.Raycast(crosshairRay.Origin, crosshairMaxAimDistanceVector);

		if (crosshairRaycastResult) {
			return crosshairRaycastResult.Position;
		} else {
			return crosshairRay.Origin.add(crosshairMaxAimDistanceVector);
		}
	}

	private renderPosition(position: Vector3) {
		const part = new Instance("Part", Workspace);
		part.Anchored = true;
		part.Color = new Color3(1, 0, 0);
		part.Transparency = 0.5;
		part.Position = position;
		part.Size = new Vector3(0.1, 5, 0.1);
	}

	private onEmpty() {
		this.tool.TextureId = EMPTY_TOOL_TEXTURE;
	}

	private getCamera() {
		const camera = Workspace.CurrentCamera;
		if (t.nil(camera)) {
			error("no current camera on workspace");
		}
		return camera;
	}
}
