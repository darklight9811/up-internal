import { observable } from "@legendapp/state";

import { syncer } from "../../utils/syncer";
import { audioManager } from "./helpers/audio-manager";

export const app$ = observable({
	state: syncer({
		initial: {
			audio: {
				mute: false,
				volume: 100,
			},
		},

		persist: {
			name: "app",
		},
	}),

	audio: {
		async play(id: string) {
			const { mute, volume } = app$.state.audio.peek();
			await audioManager.play(id);
			audioManager.setVolume(mute ? 0 : volume);
		},
		async loop(id: string) {
			const { mute, volume } = app$.state.audio.peek();
			await audioManager.loop(id);
			audioManager.setVolume(mute ? 0 : volume);
		},
		pause(id: string) {
			audioManager.pause(id);
		},
		stop(id: string) {
			audioManager.stop(id);
		},
		volume(volume: number) {
			const { mute } = app$.state.audio.peek();
			app$.state.audio.volume.set(volume);
			audioManager.setVolume(mute ? 0 : volume);
		},
		mute(mute: boolean) {
			app$.state.audio.mute.set(mute);
			audioManager.setVolume(mute ? 0 : app$.state.audio.volume.peek());
		},
	},
});
