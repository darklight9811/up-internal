import { use$ } from "@legendapp/state/react";
import { Volume2Icon, VolumeOffIcon } from "lucide-react";

import { Button } from "@repo/ds/ui/button";
import { Slider } from "@repo/ds/ui/slider";

import { app$ } from "../client";

export function AudioController() {
	const state = use$(app$.state.audio);

	return (
		<div className="flex gap-2">
			<Button size="icon" onClick={() => app$.audio.mute(!state.mute)}>
				{state.mute ? <VolumeOffIcon /> : <Volume2Icon />}
			</Button>

			<Slider
				value={[state.volume]}
				onValueChange={(v) => app$.audio.volume(v[0])}
				step={1}
				max={100}
			/>
		</div>
	);
}
