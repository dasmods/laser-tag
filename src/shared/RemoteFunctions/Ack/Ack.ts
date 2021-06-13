import { t } from "@rbxts/t";

const getRemoteFunction = (): RemoteFunction => {
	const remoteFunction = script.Parent;
	assert(t.instanceIsA("RemoteFunction")(remoteFunction));
	return remoteFunction;
};

export class AckRemoteFunction {
	init() {
		getRemoteFunction().OnServerInvoke = () => true;
	}

	invokeServer(): boolean {
		return getRemoteFunction().InvokeServer();
	}
}
