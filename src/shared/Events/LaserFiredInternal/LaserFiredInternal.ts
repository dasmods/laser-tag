import { t } from "@rbxts/t";
import { InternalEvent } from "shared/util/events";

type LaserFiredArgs = [initialCFrame: CFrame];

export class LaserFiredInternal extends InternalEvent<LaserFiredArgs> {
	getEvent() {
		const event = script.Parent;
		assert(t.instanceIsA("BindableEvent")(event));
		return event;
	}
}
