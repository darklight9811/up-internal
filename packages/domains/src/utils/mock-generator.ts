import { faker } from "@faker-js/faker";

/**
 * Generic utility for creating reusable mock generators
 */
export interface MockGenerator<T> {
	/**
	 * Generate a single mock record
	 */
	single(overrides?: Partial<T>): T;
	/**
	 * Generate multiple mock records
	 */
	many(count: number, overrides?: Partial<T>): T[];
	/**
	 * Generate mock records with a specific seed for deterministic results
	 */
	seeded<Count extends number = 1>(
		seed: number,
		count?: Count,
		overrides?: Partial<T>,
	): Count extends 1 ? T : T[];
}

/**
 * Deeply merges two objects. Arrays are not merged, but replaced.
 */
function deepMerge<T>(target: Partial<T>, source: Partial<T>): T {
	if (!target || typeof target !== "object") return source as T;
	if (!source || typeof source !== "object") return target as T;

	if (Array.isArray(target) && Array.isArray(source)) {
		return [...source] as T;
	}

	const result = { ...target } as { [K in keyof T]: T[K] };

	Object.keys(source).forEach((key) => {
		const k = key as keyof T;
		const sourceValue = source[k];
		const targetValue = target[k];

		if (
			sourceValue &&
			targetValue &&
			typeof sourceValue === "object" &&
			typeof targetValue === "object" &&
			!Array.isArray(sourceValue) &&
			!Array.isArray(targetValue) &&
			!(sourceValue instanceof Date) &&
			!(targetValue instanceof Date)
		) {
			result[k] = deepMerge(targetValue, sourceValue);
		} else if (sourceValue !== undefined) {
			result[k] = sourceValue as T[keyof T];
		}
	});

	return result as T;
}

/**
 * Create a mock generator from a base generator function
 */
export function createMockGenerator<T>(config: {
	generator: (options: { faker: typeof faker; seed?: number }) => T;
}) {
	const { generator } = config;

	return {
		single: (overrides = {}) => {
			const seed = faker.number.int();
			faker.seed(seed);
			return deepMerge(generator({ faker, seed }), overrides) as T;
		},

		many: (count, overrides = {}) =>
			Array.from({ length: count }, (_, index) => {
				const seed = faker.number.int() + index;
				faker.seed(seed);
				return deepMerge(generator({ faker, seed }), overrides) as T;
			}),

		seeded: <Count extends number = 1>(
			seed: number,
			count?: Count,
			overrides = {},
		): Count extends 1 ? T : T[] => {
			if (count === undefined || count === 1) {
				faker.seed(seed);
				const result = generator({ faker, seed });
				return deepMerge<T>(
					result,
					overrides as Partial<T>,
				) as Count extends 1 ? T : T[];
			}
			const results = Array.from({ length: count }, (_, index) => {
				faker.seed(seed + index);
				const result = generator({ faker, seed: seed + index });
				return deepMerge<T>(result, overrides as Partial<T>);
			});
			return results as Count extends 1 ? T : T[];
		},
	} satisfies MockGenerator<T>;
}
