import { t } from "@rbxts/t";

export type LaserFiredClientCallback = (firedByPlayer: Player, cframe: CFrame) => void;
export type LaserFiredServerCallback = (player: Player, cframe: CFrame) => void;

const getRemoteEvent = (): RemoteEvent => {
	const remoteEvent = script.Parent;
	assert(t.instanceIsA("RemoteEvent")(remoteEvent));
	return remoteEvent;
};

export class LaserFiredRemoteEvent {
	static dispatchToServer(cframe: CFrame) {
		getRemoteEvent().FireServer(cframe);
	}

	static dispatchToAllClients(firedByPlayer: Player, cframe: CFrame) {
		getRemoteEvent().FireAllClients(firedByPlayer, cframe);
	}

	static onServerEvent(callback: LaserFiredServerCallback) {
		getRemoteEvent().OnServerEvent.Connect((player: Player, cframe: unknown) => {
			assert(t.CFrame(cframe));
			callback(player, cframe);
		});
	}

	static onClientEvent(callback: LaserFiredClientCallback) {
		getRemoteEvent().OnClientEvent.Connect(callback);
	}
}
