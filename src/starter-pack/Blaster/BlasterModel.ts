import { LaserFiredExternal } from "shared/Events/LaserFiredExternal/LaserFiredExternal";
import { LaserFiredInternal } from "shared/Events/LaserFiredInternal/LaserFiredInternal";
import { LASER_SIZE_Z_STUDS, LASER_Y_OFFSET_STUDS, LASER_Z_OFFSET_STUDS } from "shared/lasers/LasersConstants";
import { Model } from "shared/util/models";

type Callback = (blaster: BlasterModel) => void;

const LASER_FIRED_INTERNAL = new LaserFiredInternal();
const LASER_FIRED_EXTERNAL = new LaserFiredExternal();

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
		const initialCFrame = this.calculateBulletInitialCFrame();
		LASER_FIRED_INTERNAL.dispatch(initialCFrame);
		LASER_FIRED_EXTERNAL.dispatchToServer(initialCFrame);
	}

	private calculateBulletInitialCFrame(): CFrame {
		const cFrame = this.handle.CFrame;
		const offsetMagnitudeZ = -(LASER_SIZE_Z_STUDS / 2) - LASER_Z_OFFSET_STUDS;
		const offsetMagnitudeY = LASER_Y_OFFSET_STUDS;
		const offsetCFrame = new CFrame(0, offsetMagnitudeY, offsetMagnitudeZ);
		return cFrame.ToWorldSpace(offsetCFrame);
	}
}
