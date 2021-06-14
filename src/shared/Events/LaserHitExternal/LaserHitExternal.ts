import { t } from "@rbxts/t";
import { ExternalEvent } from "shared/util/events";

type LaserHitSArgs = [hitModel: Model];
type LaserHitCArgs = [];

export class LaserHitExternal extends ExternalEvent<LaserHitSArgs, LaserHitCArgs> {
	getEvent() {
		const event = script.Parent;
		assert(t.instanceIsA("RemoteEvent")(event));
		return event;
	}

	typeCheckArgs(args: unknown[]): args is LaserHitSArgs {
		assert(args.size() === 1);
		assert(t.instanceIsA("Model")(args[0]));
		return true;
	}
}
