import { beforeEach, describe, expect, it } from "bun:test";

import { RandomGenerator } from "./random";

describe("RandomGenerator", () => {
	let generator: RandomGenerator;

	beforeEach(() => {
		generator = new RandomGenerator(12345);
	});

	describe("constructor", () => {
		it("should create a generator with valid seed", () => {
			const gen = new RandomGenerator(42);
			const state = gen.getState();
			expect(state.seed).toBe(42);
		});

		it("should create a generator with a default seed when none provided", () => {
			const gen = new RandomGenerator();
			const state = gen.getState();
			expect(typeof state.seed).toBe("number");
			expect(Number.isInteger(state.seed)).toBe(true);
		});

		it("should reject very large positive seeds", () => {
			expect(() => new RandomGenerator(4000000000)).toThrow(
				"initialSeed must be between 1 and 2147483647.",
			);
		});

		it("should reject very large negative seeds", () => {
			expect(() => new RandomGenerator(-4000000000)).toThrow(
				"initialSeed must be between 1 and 2147483647.",
			);
		});

		it("should reject problematic seed values that caused database errors", () => {
			expect(() => new RandomGenerator(2231509709)).toThrow(
				"initialSeed must be between 1 and 2147483647.",
			);
		});
	});

	describe("next", () => {
		it("should generate numbers between 0 and 1", () => {
			for (let i = 0; i < 100; i++) {
				const value = generator.next();
				expect(value).toBeGreaterThanOrEqual(0);
				expect(value).toBeLessThan(1);
			}
		});

		it("should generate deterministic sequence with same seed", () => {
			const gen1 = new RandomGenerator(42);
			const gen2 = new RandomGenerator(42);

			const sequence1 = Array.from({ length: 10 }, () => gen1.next());
			const sequence2 = Array.from({ length: 10 }, () => gen2.next());

			expect(sequence1).toEqual(sequence2);
		});

		it("should generate different sequences with different seeds", () => {
			const gen1 = new RandomGenerator(42);
			const gen2 = new RandomGenerator(43);

			const sequence1 = Array.from({ length: 10 }, () => gen1.next());
			const sequence2 = Array.from({ length: 10 }, () => gen2.next());

			expect(sequence1).not.toEqual(sequence2);
		});
	});

	describe("nextIntInRange", () => {
		it("should generate integers within specified range", () => {
			const min = 5;
			const max = 15;

			for (let i = 0; i < 100; i++) {
				const value = generator.nextIntInRange(min, max);
				expect(value).toBeGreaterThanOrEqual(min);
				expect(value).toBeLessThanOrEqual(max);
				expect(Number.isInteger(value)).toBe(true);
			}
		});

		it("should handle single value range", () => {
			const value = generator.nextIntInRange(5, 5);
			expect(value).toBe(5);
		});

		it("should throw error when min is greater than max", () => {
			expect(() => generator.nextIntInRange(10, 5)).toThrow(
				"min cannot be greater than max",
			);
		});

		it("should generate deterministic sequence with same seed", () => {
			const gen1 = new RandomGenerator(42);
			const gen2 = new RandomGenerator(42);

			const sequence1 = Array.from({ length: 10 }, () =>
				gen1.nextIntInRange(1, 100),
			);
			const sequence2 = Array.from({ length: 10 }, () =>
				gen2.nextIntInRange(1, 100),
			);

			expect(sequence1).toEqual(sequence2);
		});
	});

	describe("nextBoolean", () => {
		it("should generate boolean values", () => {
			for (let i = 0; i < 100; i++) {
				const value = generator.nextBoolean();
				expect(typeof value).toBe("boolean");
			}
		});

		it("should generate deterministic sequence with same seed", () => {
			const gen1 = new RandomGenerator(42);
			const gen2 = new RandomGenerator(42);

			const sequence1 = Array.from({ length: 10 }, () =>
				gen1.nextBoolean(),
			);
			const sequence2 = Array.from({ length: 10 }, () =>
				gen2.nextBoolean(),
			);

			expect(sequence1).toEqual(sequence2);
		});

		it("should generate both true and false values over many iterations", () => {
			const results = Array.from({ length: 1000 }, () =>
				generator.nextBoolean(),
			);
			const trueCount = results.filter(Boolean).length;
			const falseCount = results.length - trueCount;

			expect(trueCount).toBeGreaterThan(0);
			expect(falseCount).toBeGreaterThan(0);
		});
	});

	describe("shuffle", () => {
		it("should shuffle array in place", () => {
			const original = [1, 2, 3, 4, 5];
			const array = [...original];
			const result = generator.shuffle(array);

			expect(result).toBe(array);
			expect(array).toHaveLength(original.length);
			expect(array.sort()).toEqual(original.sort());
		});

		it("should handle empty array", () => {
			const array: number[] = [];
			const result = generator.shuffle(array);
			expect(result).toEqual([]);
		});

		it("should handle single element array", () => {
			const array = [42];
			const result = generator.shuffle(array);
			expect(result).toEqual([42]);
		});

		it("should generate deterministic shuffle with same seed", () => {
			const gen1 = new RandomGenerator(42);
			const gen2 = new RandomGenerator(42);

			const array1 = [1, 2, 3, 4, 5];
			const array2 = [1, 2, 3, 4, 5];

			gen1.shuffle(array1);
			gen2.shuffle(array2);

			expect(array1).toEqual(array2);
		});

		it("should handle different data types", () => {
			const array = ["a", "b", "c", "d"];
			const result = generator.shuffle(array);
			expect(result).toHaveLength(4);
			expect(result.sort()).toEqual(["a", "b", "c", "d"]);
		});
	});

	describe("skip", () => {
		it("should advance generator state by specified rounds", () => {
			const gen1 = new RandomGenerator(42);
			const gen2 = new RandomGenerator(42);

			gen1.skip(5);

			for (let i = 0; i < 5; i++) {
				gen2.next();
			}

			expect(gen1.next()).toBe(gen2.next());
		});

		it("should handle skipping zero rounds", () => {
			const stateBefore = generator.getState();
			generator.skip(0);
			const stateAfter = generator.getState();

			expect(stateAfter.seed).toBe(stateBefore.seed);
		});

		it("should throw error for negative rounds", () => {
			expect(() => generator.skip(-1)).toThrow(
				"rounds must be a non-negative integer number.",
			);
		});

		it("should throw error for non-integer rounds", () => {
			expect(() => generator.skip(1.5)).toThrow(
				"rounds must be a non-negative integer number.",
			);
		});

		it("should throw error for non-number rounds", () => {
			expect(() => generator.skip("5" as unknown as number)).toThrow(
				"rounds must be a non-negative integer number.",
			);
		});

		it("should skip large number of rounds efficiently", () => {
			const stateBefore = generator.getState();
			generator.skip(10000);
			const stateAfter = generator.getState();

			expect(stateAfter.seed).not.toBe(stateBefore.seed);
		});
	});

	describe("getState", () => {
		it("should return current state", () => {
			const state = generator.getState();
			expect(state).toHaveProperty("seed");
			expect(typeof state.seed).toBe("number");
			expect(Number.isInteger(state.seed)).toBe(true);
		});

		it("should return different state after generating numbers", () => {
			const stateBefore = generator.getState();
			generator.next();
			const stateAfter = generator.getState();

			expect(stateAfter.seed).not.toBe(stateBefore.seed);
		});
	});

	describe("setState", () => {
		it("should set generator state", () => {
			const originalState = generator.getState();
			generator.next();
			generator.setState(originalState);

			expect(generator.getState()).toEqual(originalState);
		});

		it("should allow resuming from saved state", () => {
			const gen1 = new RandomGenerator(42);
			const gen2 = new RandomGenerator(42);

			gen1.next();
			gen1.next();
			const state = gen1.getState();

			gen2.next();
			gen2.next();
			gen2.setState(state);

			expect(gen1.next()).toBe(gen2.next());
		});

		it("should throw error for invalid state with non-number seed", () => {
			expect(() =>
				generator.setState({ seed: "invalid" as unknown as number }),
			).toThrow("Invalid state: seed must be an integer number.");
		});

		it("should throw error for invalid state with non-integer seed", () => {
			expect(() => generator.setState({ seed: 1.5 })).toThrow(
				"Invalid state: seed must be an integer number.",
			);
		});
	});

	describe("integration tests", () => {
		it("should maintain consistency across different operations", () => {
			const gen1 = new RandomGenerator(42);
			const gen2 = new RandomGenerator(42);

			gen1.next();
			gen1.nextIntInRange(1, 10);
			gen1.nextBoolean();
			gen1.skip(3);

			gen2.next();
			gen2.nextIntInRange(1, 10);
			gen2.nextBoolean();
			gen2.skip(3);

			expect(gen1.getState()).toEqual(gen2.getState());
		});

		it("should work correctly with state save/restore during operations", () => {
			const array = [1, 2, 3, 4, 5];
			const state = generator.getState();

			generator.shuffle(array);
			generator.setState(state);

			const array2 = [1, 2, 3, 4, 5];
			generator.shuffle(array2);

			expect(array).toEqual(array2);
		});
	});

	describe("getDatabaseSafeSeed", () => {
		it("should return database-safe seed within valid range", () => {
			const seed = generator.getDatabaseSafeSeed();
			expect(seed).toBeGreaterThanOrEqual(1);
			expect(seed).toBeLessThanOrEqual(2147483647);
		});

		it("should reject very large positive seeds", () => {
			expect(() => new RandomGenerator(4000000000)).toThrow(
				"initialSeed must be between 1 and 2147483647.",
			);
		});

		it("should reject very large negative seeds", () => {
			expect(() => new RandomGenerator(-4000000000)).toThrow(
				"initialSeed must be between 1 and 2147483647.",
			);
		});

		it("should handle the maximum safe seed value", () => {
			const gen = new RandomGenerator(2147483647);
			const seed = gen.getDatabaseSafeSeed();
			expect(seed).toBe(2147483647);
		});

		it("should reject problematic seed values that caused database errors", () => {
			expect(() => new RandomGenerator(2231509709)).toThrow(
				"initialSeed must be between 1 and 2147483647.",
			);
		});

		it("should generate different seeds as generator state changes", () => {
			const gen = new RandomGenerator(12345);
			const seed1 = gen.getDatabaseSafeSeed();
			gen.next();
			const seed2 = gen.getDatabaseSafeSeed();
			expect(seed1).not.toBe(seed2);
			expect(seed1).toBeGreaterThanOrEqual(1);
			expect(seed1).toBeLessThanOrEqual(2147483647);
			expect(seed2).toBeGreaterThanOrEqual(1);
			expect(seed2).toBeLessThanOrEqual(2147483647);
		});
	});

	describe("fromDatabaseSeed", () => {
		it("should create generator from database-safe seed", () => {
			const gen = new RandomGenerator(1234567);
			expect(gen.getDatabaseSafeSeed()).toBe(1234567);
		});

		it("should throw error for invalid database seed", () => {
			expect(() => new RandomGenerator(0)).toThrow(
				"initialSeed must be between 1 and 2147483647.",
			);
			expect(() => new RandomGenerator(2147483648)).toThrow(
				"initialSeed must be between 1 and 2147483647.",
			);
		});

		it("should throw error for non-integer database seed", () => {
			expect(() => new RandomGenerator(1.5)).toThrow(
				"initialSeed must be an integer number.",
			);
		});

		it("should throw error for non-number database seed", () => {
			expect(
				() => new RandomGenerator("123" as unknown as number),
			).toThrow("initialSeed must be an integer number.");
		});
	});
});
