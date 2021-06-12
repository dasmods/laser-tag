import { t } from "@rbxts/t";
import { ExternalEvent } from "shared/util/events";

type LaserFiredSArgs = [cframe: CFrame];
type LaserFiredCArgs = [firedByPlayer: Player, cframe: CFrame];

export class LaserFiredExternal extends ExternalEvent<LaserFiredSArgs, LaserFiredCArgs> {
	getEvent() {
		const remoteEvent = script.Parent;
		assert(t.instanceIsA("RemoteEvent")(remoteEvent));
		return remoteEvent;
	}

	typeCheckArgs(args: unknown[]): args is LaserFiredSArgs {
		assert(args.size() === 1);
		assert(t.CFrame(args[0]));
		return true;
	}
}
