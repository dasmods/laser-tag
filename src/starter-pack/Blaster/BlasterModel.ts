import { LaserFiredEvent as LaserFiredRemoteEvent } from "shared/Events/LaserFired/LaserFiredEvent";
import { LaserFiredEvent as LaserFiredLocalEvent } from "client/Events/LaserFired/LaserFiredEvent";
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

	fire(position: Vector3) {
		LaserFiredLocalEvent.dispatchToSelf();
		LaserFiredRemoteEvent.dispatchToServer();
	}

	getPosition() {
		return this.handle.Position;
	}
}
