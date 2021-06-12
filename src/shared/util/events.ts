type EventCallback<T extends unknown[]> = (...args: T) => void;
type RemoteEventCallback<T extends unknown[]> = (player: Player, ...args: T) => void;

abstract class Event<E extends BindableEvent | RemoteEvent> {
	abstract getEvent(): E;
}

export abstract class InternalEvent<Args extends unknown[]> extends Event<BindableEvent> {
	dispatch(...args: Args) {
		this.getEvent().Fire(...args);
	}

	onEvent(callback: EventCallback<Args>) {
		this.getEvent().Event.Connect(callback);
	}
}

/**
 * SArgs are arguments from client to server arguments.
 * CArgs are arguments from server to client arguments.
 */
export abstract class ExternalEvent<SArgs extends unknown[], CArgs extends unknown[]> extends Event<RemoteEvent> {
	abstract typeCheckArgs(args: unknown[]): args is SArgs;

	onServerEvent(callback: RemoteEventCallback<SArgs>) {
		this.getEvent().OnServerEvent.Connect((player: Player, ...args: unknown[]) => {
			assert(this.typeCheckArgs(args));
			callback(player, ...args);
		});
	}

	onClientEvent(callback: EventCallback<CArgs>) {
		this.getEvent().OnClientEvent.Connect(callback);
	}

	dispatchToServer(...args: SArgs) {
		this.getEvent().FireServer(...args);
	}

	dispatchToClient(player: Player, ...args: SArgs) {
		this.getEvent().FireClient(player, ...args);
	}

	dispatchToAllClients(...args: CArgs) {
		this.getEvent().FireAllClients(...args);
	}
}
