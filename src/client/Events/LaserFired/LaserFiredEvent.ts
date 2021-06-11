import { t } from "@rbxts/t";

export type LaserFiredCallback = () => void;

const getEvent = (): BindableEvent => {
	const event = script.Parent;
	assert(t.instanceIsA("BindableEvent")(event));
	return event;
};

export class LaserFiredEvent {
	static onClientEvent(callback: LaserFiredCallback) {
		getEvent().Event.Connect(callback);
	}

	static dispatchToSelf() {
		getEvent().Fire();
	}
}
