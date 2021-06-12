import { t } from "@rbxts/t";
import { ExternalEvent } from "shared/util/events";

type LaserFiredSArgs = [initialVelocity: CFrame];
type LaserFiredCArgs = [firedByPlayer: Player, initialVelocity: CFrame];

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
