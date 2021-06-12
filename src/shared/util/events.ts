type EventCallback<T extends unknown[]> = (...args: T) => void;
type ClientToServerEventCallback<T extends unknown[]> = (player: Player, ...args: T) => void;

abstract class Event<E extends BindableEvent | RemoteEvent> {
	abstract getEvent(): E;
}

export abstract class ClientToClientEvent<T extends unknown[]> extends Event<BindableEvent> {
	dispatchToClient(...args: T) {
		this.getEvent().Fire(...args);
	}

	onEvent(callback: EventCallback<T>) {
		this.getEvent().Event.Connect(callback);
	}
}

export abstract class ServerToServerEvent<T extends unknown[]> extends Event<BindableEvent> {
	dispatchToServer(...args: T) {
		this.getEvent().Fire(...args);
	}

	onEvent(callback: EventCallback<T>) {
		this.getEvent().Event.Connect(callback);
	}
}

export abstract class ClientToServerEvent<T extends unknown[]> extends Event<RemoteEvent> {
	abstract typeCheckArgs(args: unknown[]): args is T;

	dispatchToServer(...args: T) {
		this.getEvent().FireServer(...args);
	}

	onEvent(callback: ClientToServerEventCallback<T>) {
		this.getEvent().OnServerEvent.Connect((player: Player, ...args: unknown[]) => {
			assert(this.typeCheckArgs(args));
			callback(player, ...args);
		});
	}
}

export abstract class ServerToClientsEvent<T extends unknown[]> extends Event<RemoteEvent> {
	dispatchToAllClients(...args: T) {
		this.getEvent().FireAllClients(...args);
	}

	dispatchToClient(player: Player, ...args: T) {
		this.getEvent().FireClient(player, ...args);
	}

	onEvent(callback: EventCallback<T>) {
		this.getEvent().OnClientEvent.Connect(callback);
	}
}
