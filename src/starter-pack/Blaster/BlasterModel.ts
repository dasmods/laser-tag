type Callback = (blaster: BlasterModel) => void;

export class BlasterModel {
	private tool: Tool;

	constructor(tool: Tool) {
		this.tool = tool;
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
		print("firing!");
	}
}
