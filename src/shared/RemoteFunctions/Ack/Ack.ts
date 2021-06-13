import { RunService } from "@rbxts/services";
import { t } from "@rbxts/t";

const getRemoteFunction = (): RemoteFunction => {
	const remoteFunction = script.Parent;
	assert(t.instanceIsA("RemoteFunction")(remoteFunction));
	return remoteFunction;
};

export class AckRemoteFunction {
	init() {
		if (RunService.IsServer()) {
			getRemoteFunction().OnServerInvoke = () => true;
		}
	}

	invokeServer(): boolean {
		return getRemoteFunction().InvokeServer();
	}
}
