type ExternalFunctionCallback<Args extends unknown[], T> = (player: Player, ...a: Args) => T;

export abstract class ExternalFunction<Args extends unknown[], T> {
	abstract getFunction(): RemoteFunction;

	abstract typeCheckArgs(args: unknown[]): args is Args;

	onServerInvoke(callback: ExternalFunctionCallback<Args, T>) {
		this.getFunction().OnServerInvoke = (player: Player, ...args: unknown[]) => {
			assert(this.typeCheckArgs(args));
			callback(player, ...args);
		};
	}

	invokeServer(...args: Args) {
		this.getFunction().InvokeServer(args);
	}
}
