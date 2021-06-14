import { t } from "@rbxts/t";
import { ExternalEvent } from "shared/util/events";

type LaserFiredSArgs = [pingMs: number, firedFrom: CFrame];
type LaserFiredCArgs = [firedBy: Player, firedAtSecAgo: number, firedFrom: CFrame];

export class LaserFiredExternal extends ExternalEvent<LaserFiredSArgs, LaserFiredCArgs> {
	getEvent() {
		const remoteEvent = script.Parent;
		assert(t.instanceIsA("RemoteEvent")(remoteEvent));
		return remoteEvent;
	}

	typeCheckArgs(args: unknown[]): args is LaserFiredSArgs {
		assert(args.size() === 2);
		assert(t.number(args[0])); // firedAt
		assert(t.CFrame(args[1])); // firedFrom
		return true;
	}
}
