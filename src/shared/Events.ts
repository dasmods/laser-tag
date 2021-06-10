import { ReplicatedStorage } from "@rbxts/services";
import { t } from "@rbxts/t";

type EventsFolder = Folder & {
	DamageCharacter: RemoteEvent;
	LaserFired: RemoteEvent;
};

const isFolder = (value: unknown): value is Folder => {
	const checkIsFolder = t.instanceIsA("Folder");
	return checkIsFolder(value);
};

const eventsFolder = ReplicatedStorage.WaitForChild("Events");
assert(isFolder(eventsFolder));
const Events = eventsFolder as EventsFolder;

export { Events };
