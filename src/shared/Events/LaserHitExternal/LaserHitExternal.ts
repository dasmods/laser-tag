import { t } from "@rbxts/t";
import { ExternalEvent } from "shared/util/events";

type LaserHitSArgs = [laserId: string];
type LaserHitCArgs = [];

export class LaserHitExternal extends ExternalEvent<LaserHitSArgs, LaserHitCArgs> {
	getEvent() {
		const event = script.Parent;
		assert(t.instanceIsA("RemoteEvent")(event));
		return event;
	}

	typeCheckArgs(args: unknown[]): args is LaserHitSArgs {
		assert(args.size() === 1);
		assert(t.string(args[0]));
		// TODO(jared) Ensure that the laserId is a UUID, since it originates
		// from the client.
		return true;
	}
}
