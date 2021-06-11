import { t } from "@rbxts/t";

export type LaserFiredLocalCallback = (cframe: CFrame) => void;

const getEvent = (): BindableEvent => {
	const event = script.Parent;
	assert(t.instanceIsA("BindableEvent")(event));
	return event;
};

export class LaserFiredLocalEvent {
	static onClientEvent(callback: LaserFiredLocalCallback) {
		getEvent().Event.Connect(callback);
	}

	static dispatchToSelf(cframe: CFrame) {
		getEvent().Fire(cframe);
	}
}
