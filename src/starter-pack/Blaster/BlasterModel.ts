import { LaserFiredLocalEvent } from "shared/Events/LaserFiredLocal/LaserFiredLocalEvent";
import { LaserFiredClientToServerEvent } from "shared/Events/LaserFiredRemote/LaserFiredRemote";
import { Model } from "shared/util/models";

type Callback = (blaster: BlasterModel) => void;

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

	fire(cframe: CFrame) {
		LaserFiredLocalEvent.dispatchToSelf(cframe);
		new LaserFiredClientToServerEvent().dispatchToServer(cframe);
	}

	getPosition() {
		return this.handle.Position;
	}
}
