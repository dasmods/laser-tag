import { LaserFiredInternal } from "shared/Events/LaserFiredInternal/LaserFiredInternal";
import { LASER_SIZE_Z_STUDS, LASER_Y_OFFSET_STUDS, LASER_Z_OFFSET_STUDS } from "shared/lasers/LasersConstants";
import { Model } from "shared/util/models";
import { Players } from "@rbxts/services";
import { BlasterFSM, createBlasterFSM } from "starter-pack/Blaster/BlasterFSM";
import {
	DEFAULT_TOOL_TEXTURE,
	EMPTY_TOOL_TEXTURE,
	FIRE_RATE_HZ,
	MAX_AMMO,
	RELOADING_TOOL_TEXTURE,
	RELOAD_TIME_SEC,
} from "starter-pack/Blaster/BlasterConstants";

type Callback = (blaster: BlasterModel) => void;

const LASER_FIRED_INTERNAL = new LaserFiredInternal();
const LOCAL_PLAYER = Players.LocalPlayer;

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

	init() {}

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
	}

	private async doFire() {
		this.ammo--;
		const firedFrom = this.calculateFiredFrom();
		LASER_FIRED_INTERNAL.dispatch(firedFrom);
		await Promise.delay(FIRE_RATE_HZ);
	}

	private calculateFiredFrom(): CFrame {
		const cFrame = LOCAL_PLAYER.GetMouse().Origin;
		const offsetMagnitudeZ = -(LASER_SIZE_Z_STUDS / 2) - LASER_Z_OFFSET_STUDS;
		const offsetMagnitudeY = LASER_Y_OFFSET_STUDS;
		const offsetCFrame = new CFrame(0, offsetMagnitudeY, offsetMagnitudeZ);
		return cFrame.ToWorldSpace(offsetCFrame);
	}

	private onEmpty() {
		this.tool.TextureId = EMPTY_TOOL_TEXTURE;
	}
}
