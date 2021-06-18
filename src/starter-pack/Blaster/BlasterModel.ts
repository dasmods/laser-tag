import { LaserFiredInternal } from "shared/Events/LaserFiredInternal/LaserFiredInternal";
import { LASER_SIZE_Z_STUDS, LASER_Y_OFFSET_STUDS, LASER_Z_OFFSET_STUDS } from "shared/lasers/LasersConstants";
import { Model } from "shared/util/models";
import { Players } from "@rbxts/services";
import { BlasterFSM, createBlasterFSM } from "starter-pack/Blaster/BlasterFSM";

type Callback = (blaster: BlasterModel) => void;

const LASER_FIRED_INTERNAL = new LaserFiredInternal();
const LOCAL_PLAYER = Players.LocalPlayer;

export class BlasterModel extends Model {
	private tool: Tool;
	private handle: MeshPart;

	private ammo = 30;
	private fsm: BlasterFSM;

	constructor(tool: Tool, handle: MeshPart) {
		super();
		this.tool = tool;
		this.handle = handle;

		this.fsm = createBlasterFSM({
			fire: async () => {
				this.ammo--;
				print(`fired! ammo left ${this.ammo}`);
				await Promise.delay(1);
				print("ready to fire!");
			},
			reload: async () => {
				print("reloading!");
				await Promise.delay(2);
				print("done reloading!");
				this.ammo = 30;
			},
			hasAmmo: () => this.ammo > 0,
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

		const firedFrom = this.calculateFiredFrom();
		LASER_FIRED_INTERNAL.dispatch(firedFrom);
	}

	private calculateFiredFrom(): CFrame {
		const cFrame = LOCAL_PLAYER.GetMouse().Origin;
		const offsetMagnitudeZ = -(LASER_SIZE_Z_STUDS / 2) - LASER_Z_OFFSET_STUDS;
		const offsetMagnitudeY = LASER_Y_OFFSET_STUDS;
		const offsetCFrame = new CFrame(0, offsetMagnitudeY, offsetMagnitudeZ);
		return cFrame.ToWorldSpace(offsetCFrame);
	}
}
