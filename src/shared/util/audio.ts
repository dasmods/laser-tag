import { SoundService } from "@rbxts/services";

export abstract class Audio {
	protected abstract getSound(): Sound;

	playLocal() {
		SoundService.PlayLocalSound(this.getSound());
	}
}
