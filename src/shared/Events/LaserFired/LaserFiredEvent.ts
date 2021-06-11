import { t } from "@rbxts/t";

export type LaserFiredClientCallback = () => void;
export type LaserFiredServerCallback = (player: Player) => void;

const getRemoteEvent = (): RemoteEvent => {
	const remoteEvent = script.Parent;
	assert(t.instanceIsA("RemoteEvent")(remoteEvent));
	return remoteEvent;
};

export class LaserFiredEvent {
	static dispatchToServer() {
		getRemoteEvent().FireServer();
	}

	static dispatchToAllClients() {
		getRemoteEvent().FireAllClients();
	}

	static onServerEvent(callback: LaserFiredServerCallback) {
		getRemoteEvent().OnServerEvent.Connect(callback);
	}

	static onClientEvent(callback: LaserFiredClientCallback) {
		getRemoteEvent().OnClientEvent.Connect(callback);
	}
}
