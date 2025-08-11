export function clamp(value: number, max: number, min: number = 0): number {
	return value > max ? max : value < min ? min : value;
}

export function lerp(start: number, end: number, t: number): number {
	return start + (end - start) * t;
}

/**
 * ### random pick
 *
 * Randomly picks an object from an array based on its spawn chance.
 */
export function randomPick<Objects extends { spawnChance: number }[]>(
	objects: Objects,
	randomRawValue: number = Math.random(),
): Objects[number] {
	return objects[randomPickIndex(objects, randomRawValue)];
}

/**
 * ### random pick index
 */
export function randomPickIndex<Objects extends { spawnChance: number }[]>(
	objects: Objects,
	randomRawValue: number = Math.random(),
): number {
	const totalChance = objects.reduce((sum, obj) => sum + obj.spawnChance, 0);
	const randomValue = randomRawValue * totalChance;

	let cumulativeChance = 0;
	for (let i = 0; i < objects.length; i++) {
		cumulativeChance += objects[i].spawnChance;
		if (randomValue < cumulativeChance) {
			return i;
		}
	}

	return 0;
}

export function formatNumber(num: number) {
	if (num >= 1_000_000_000) {
		return `${(num / 1_000_000_000).toFixed(1).replace(/\.0$/, "")}b`;
	}
	if (num >= 1_000_000) {
		return `${(num / 1_000_000).toFixed(1).replace(/\.0$/, "")}m`;
	}
	if (num >= 1_000) {
		return `${(num / 1_000).toFixed(1).replace(/\.0$/, "")}k`;
	}
	return Math.ceil(num).toString();
}
