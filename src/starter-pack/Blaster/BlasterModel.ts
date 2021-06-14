import { TimeService } from "shared/time/TimeService";
import { LaserFiredExternal } from "shared/Events/LaserFiredExternal/LaserFiredExternal";
import { LaserFiredInternal } from "shared/Events/LaserFiredInternal/LaserFiredInternal";
import { LASER_SIZE_Z_STUDS, LASER_Y_OFFSET_STUDS, LASER_Z_OFFSET_STUDS } from "shared/lasers/LasersConstants";
import { Model } from "shared/util/models";
import { Players } from "@rbxts/services";

type Callback = (blaster: BlasterModel) => void;

const LASER_FIRED_INTERNAL = new LaserFiredInternal();
const LASER_FIRED_EXTERNAL = new LaserFiredExternal();
const LOCAL_PLAYER = Players.LocalPlayer;
const TIME_SERVICE = TimeService.getInstance();

export class BlasterModel extends Model {
	private tool: Tool;
	private handle: MeshPart;

	constructor(tool: Tool, handle: MeshPart) {
		super();
		this.tool = tool;
		this.handle = handle;
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
		print("reloading!");
	}

	fire() {
		const pingMs = TIME_SERVICE.getRunningAveragePingMs();
		const firedFrom = this.calculateFiredFrom();
		LASER_FIRED_INTERNAL.dispatch(firedFrom);
		LASER_FIRED_EXTERNAL.dispatchToServer(pingMs, firedFrom);
	}

	private calculateFiredFrom(): CFrame {
		const cFrame = LOCAL_PLAYER.GetMouse().Origin;
		const offsetMagnitudeZ = -(LASER_SIZE_Z_STUDS / 2) - LASER_Z_OFFSET_STUDS;
		const offsetMagnitudeY = LASER_Y_OFFSET_STUDS;
		const offsetCFrame = new CFrame(0, offsetMagnitudeY, offsetMagnitudeZ);
		return cFrame.ToWorldSpace(offsetCFrame);
	}
}
