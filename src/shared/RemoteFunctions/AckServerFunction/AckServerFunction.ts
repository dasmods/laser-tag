import { t } from "@rbxts/t";
import { ServerFunction } from "shared/util/remoteFunctions";

type AckArgs = [];
type AckReturn = boolean;

export class AckServerFunction extends ServerFunction<AckArgs, AckReturn> {
	getRemoteFunction() {
		const remoteFunction = script.Parent;
		assert(t.instanceIsA("RemoteFunction")(remoteFunction));
		return remoteFunction;
	}

	typeCheckArgs(args: unknown[]): args is AckArgs {
		assert(args.size() === 0);
		return true;
	}

	onServerInvoke(player: Player) {
		return true;
	}
}
