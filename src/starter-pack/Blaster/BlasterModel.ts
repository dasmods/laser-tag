export class BlasterModel {
	tool: Tool;

	constructor(tool: Tool) {
		this.tool = tool;
	}

	reload() {
		print("reloading!");
	}

	fire() {
		print("firing!");
	}
}
