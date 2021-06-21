import { t } from "@rbxts/t";
import { ExternalEvent } from "shared/util/events";

type PingSArgs = [pingId: string];
type PingCArgs = [pingId: string];

export class Ping extends ExternalEvent<PingSArgs, PingCArgs> {
	getEvent() {
		const remoteEvent = script.Parent;
		assert(t.instanceIsA("RemoteEvent")(remoteEvent));
		return remoteEvent;
	}

	typeCheckArgs(args: unknown[]): args is PingSArgs {
		assert(args.size() === 1);
		assert(t.string(args[0])); // pingId
		return true;
	}
}
