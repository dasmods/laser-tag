import { t } from "@rbxts/t";
import { ExternalEvent } from "shared/util/events";

type LaserFiredSArgs = [laserId: string, pingMs: number, firedFrom: CFrame];
type LaserFiredCArgs = [laserId: string, firedBy: Player, firedAtSecAgo: number, firedFrom: CFrame];

export class LaserFiredExternal extends ExternalEvent<LaserFiredSArgs, LaserFiredCArgs> {
	getEvent() {
		const remoteEvent = script.Parent;
		assert(t.instanceIsA("RemoteEvent")(remoteEvent));
		return remoteEvent;
	}

	typeCheckArgs(args: unknown[]): args is LaserFiredSArgs {
		assert(args.size() === 3);
		assert(t.string(args[0])); // laserId
		assert(t.number(args[1])); // pingMs
		assert(t.CFrame(args[2])); // firedFrom
		return true;
	}
}
