import { t } from "@rbxts/t";
import { ClientToServerEvent, ServerToClientsEvent } from "shared/util/events";

type LaserFiredClientToServerArgs = [cframe: CFrame];
type LaserFiredServerToClientArgs = [player: Player, cframe: CFrame];

const getRemoteEvent = () => {
	const remoteEvent = script.Parent;
	assert(t.instanceIsA("RemoteEvent")(remoteEvent));
	return remoteEvent;
};

export class LaserFiredClientToServerEvent extends ClientToServerEvent<LaserFiredClientToServerArgs> {
	getEvent() {
		return getRemoteEvent();
	}

	typeCheckArgs(args: unknown[]): args is LaserFiredClientToServerArgs {
		assert(args.size() === 1);
		assert(t.CFrame(args[0]));
		return true;
	}
}

export class LaserFiredServerToClientEvent extends ServerToClientsEvent<LaserFiredServerToClientArgs> {
	getEvent() {
		return getRemoteEvent();
	}
}
