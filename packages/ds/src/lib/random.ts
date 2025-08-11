/**
 * Represents the state of the random number generator at a specific point in time,
 * allowing for resumability.
 */
interface RandomGeneratorState {
	seed: number;
}

/**
 * Implements a simple Linear Congruential Generator (LCG) for pseudorandom
 * number generation with seed and resumability capabilities.
 *
 * The generator works exclusively with database-safe seed values (1 to 2147483647)
 * to ensure all operations are compatible with PostgreSQL integer constraints.
 */
export class RandomGenerator {
	// LCG parameters adapted for safe seed range
	private readonly a: number = 1664525; // Multiplier
	private readonly c: number = 1013904223; // Increment
	private readonly maxSeed: number = 2147483647; // Maximum allowed seed value (2^31 - 1)

	private currentSeed: number;

	/**
	 * Creates a new RandomGenerator instance.
	 * @param initialSeed The initial seed for the generator. If not provided,
	 * a quasi-random seed based on current time will be used. Must be between 1 and 2147483647.
	 */
	constructor(initialSeed?: number) {
		if (initialSeed !== undefined) {
			if (
				typeof initialSeed !== "number" ||
				!Number.isInteger(initialSeed)
			) {
				throw new Error("initialSeed must be an integer number.");
			}
			if (initialSeed < 1 || initialSeed > this.maxSeed) {
				throw new Error(
					`initialSeed must be between 1 and ${this.maxSeed}.`,
				);
			}
		}
		this.currentSeed = initialSeed ?? this.getDefaultSeed();
	}

	/**
	 * Generates a quasi-random default seed based on the current time.
	 * This is useful when no initial seed is provided.
	 * @returns A quasi-random seed.
	 */
	private getDefaultSeed() {
		return Math.floor(Math.random() * this.maxSeed) + 1;
	}

	/**
	 * Generates the next pseudorandom integer within the safe seed range.
	 * @returns The next pseudorandom integer.
	 */
	private nextInt() {
		// Use safe seed range for modulo operation
		this.currentSeed = (this.a * this.currentSeed + this.c) % this.maxSeed;
		// Ensure we stay within [1, maxSeed] range
		if (this.currentSeed <= 0) {
			this.currentSeed += this.maxSeed;
		}
		return this.currentSeed;
	}

	/**
	 * Generates a pseudorandom number between 0 (inclusive) and 1 (exclusive).
	 * @returns A pseudorandom floating-point number.
	 */
	public next() {
		return this.nextInt() / this.maxSeed;
	}

	/**
	 * Generates a pseudorandom integer within a specified range [min, max].
	 * @param min The minimum value (inclusive).
	 * @param max The maximum value (inclusive).
	 * @returns A pseudorandom integer within the specified range.
	 */
	public nextIntInRange(min: number, max: number) {
		if (min > max) {
			throw new Error("min cannot be greater than max");
		}
		const range = max - min + 1;
		return Math.floor(this.next() * range) + min;
	}

	/**
	 * Generates a pseudorandom boolean value.
	 * @returns True or false with 50/50 probability.
	 */
	public nextBoolean() {
		return this.next() >= 0.5;
	}

	/**
	 * Shuffles an array randomly using the current generator's sequence.
	 * Implements the Fisher-Yates (Knuth) shuffle algorithm.
	 * @param array The array to shuffle in-place.
	 * @returns The shuffled array.
	 */
	public shuffle<T>(array: T[]): T[] {
		let currentIndex = array.length;
		let randomIndex: number;

		// While there remain elements to shuffle.
		while (currentIndex !== 0) {
			// Pick a remaining element.
			randomIndex = Math.floor(this.next() * currentIndex);
			currentIndex--;

			// And swap it with the current element.
			[array[currentIndex], array[randomIndex]] = [
				array[randomIndex],
				array[currentIndex],
			];
		}

		return array;
	}

	/**
	 * Advances the random generator by skipping a specified number of rounds.
	 * This is useful for fast-forwarding the generator state without generating values.
	 * @param rounds The number of rounds to skip (must be positive).
	 */
	public skip(rounds: number) {
		if (
			typeof rounds !== "number" ||
			!Number.isInteger(rounds) ||
			rounds < 0
		) {
			throw new Error("rounds must be a non-negative integer number.");
		}

		for (let i = 0; i < rounds; i++) {
			this.nextInt();
		}
	}

	/**
	 * Gets the current state of the random number generator.
	 * This state can be used to resume the generator later.
	 * @returns An object representing the current state.
	 */
	public getState() {
		return { seed: this.currentSeed };
	}

	/**
	 * Gets the current seed value, which is always database-safe.
	 * @returns The current seed value.
	 */
	public getDatabaseSafeSeed() {
		return this.currentSeed;
	}

	/**
	 * Sets the state of the random number generator, allowing it to resume
	 * from a previously saved point.
	 * @param state The state object obtained from `getState()`.
	 */
	public setState(state: RandomGeneratorState) {
		if (typeof state.seed !== "number" || !Number.isInteger(state.seed)) {
			throw new Error("Invalid state: seed must be an integer number.");
		}
		if (state.seed < 1 || state.seed > this.maxSeed) {
			throw new Error(
				`Invalid state: seed must be between 1 and ${this.maxSeed}.`,
			);
		}
		this.currentSeed = state.seed;
	}
}
