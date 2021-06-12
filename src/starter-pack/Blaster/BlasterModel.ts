import { LaserFiredExternal } from "shared/Events/LaserFiredExternal/LaserFiredExternal";
import { LaserFiredInternal } from "shared/Events/LaserFiredInternal/LaserFiredInternal";
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
		const initialCFrame = this.calculateBulletinitialCFrame();
		LASER_FIRED_INTERNAL.dispatch(initialCFrame);
		LASER_FIRED_EXTERNAL.dispatchToServer(initialCFrame);
	}

	private calculateBulletinitialCFrame(): CFrame {
		return this.handle.CFrame;
	}
}
