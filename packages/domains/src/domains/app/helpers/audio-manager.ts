type Clips = string;

const map = new Map<string, HTMLAudioElement>();
let volume = 100;

export const audioManager = {
	load(id: Clips) {
		const audio = map.get(id);
		if (audio) return audio;
		const newAudio = new Audio(`/sounds/${id}.mp3`);
		newAudio.loop = false;
		newAudio.volume = volume / 400;
		map.set(id, newAudio);
		return newAudio;
	},
	play(id: Clips) {
		const audio = audioManager.load(id);
		audio.currentTime = 0;
		audio.loop = false;
		return audio.play();
	},
	loop(id: Clips) {
		const audio = audioManager.load(id);
		audio.loop = true;
		return audio.play();
	},
	pause(id: Clips) {
		const audio = map.get(id);
		if (audio) {
			audio.pause();
		}
	},
	stop(id: Clips) {
		const audio = map.get(id);

		if (audio) {
			audio.pause();
			audio.currentTime = 0;
		}
	},
	setVolume(newVolume: number) {
		volume = newVolume;
		for (const audio of map.values()) {
			audio.volume = newVolume / 400;
		}
	},
};
