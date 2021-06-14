import { RunService } from "@rbxts/services";

abstract class ExternallyRunFunction {
	abstract getRemoteFunction(): RemoteFunction;
}

export abstract class ServerFunction<Args extends unknown[], T> extends ExternallyRunFunction {
	abstract typeCheckArgs(args: unknown[]): args is Args;

	abstract onServerInvoke(player: Player, ...args: Args): T;

	initServer() {
		if (!RunService.IsServer()) {
			error("cannot call initServer() in a non-server environment");
		}
		this.getRemoteFunction().OnServerInvoke = (player: Player, ...args: unknown[]): T => {
			assert(this.typeCheckArgs(args));
			return this.onServerInvoke(player, ...args);
		};
	}

	invokeServer(...args: Args) {
		this.getRemoteFunction().InvokeServer(args);
	}
}
export abstract class ClientFunction<Args extends unknown[], T> extends ExternallyRunFunction {
	abstract onClientInvoke(...args: Args): T;

	initClient() {
		if (!RunService.IsServer()) {
			error("cannot call initClient() in a non-client environment");
		}
		this.getRemoteFunction().OnClientInvoke = (...args: Args): T => {
			return this.onClientInvoke(...args);
		};
	}

	invokeClient(player: Player, ...args: Args) {
		this.getRemoteFunction().InvokeClient(player, ...args);
	}
}
