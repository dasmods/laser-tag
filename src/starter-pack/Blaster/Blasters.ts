import { t } from "@rbxts/t";
import { BlasterModel } from "starter-pack/Blaster/BlasterModel";

const isTool = (value: unknown): value is Tool => {
	const checkIsTool = t.instanceIsA("Tool");
	return checkIsTool(value);
};

export const getBlaster = () => {
	const tool = script.Parent;
	assert(isTool(tool));
	return new BlasterModel(tool);
};
