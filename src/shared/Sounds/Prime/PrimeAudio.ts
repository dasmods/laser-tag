import { t } from "@rbxts/t";
import { Audio } from "shared/util/audio";

export class PrimeAudio extends Audio {
	getSound() {
		const sound = script.Parent;
		assert(t.instanceIsA("Sound")(sound));
		sound.SoundId = "rbxassetid://6925284499";
		return sound;
	}
}
