import { describe, expect, it } from "bun:test";

import { createMockGenerator } from "./mock-generator";

interface TestType {
	id: number;
	name: string;
}

describe("createMockGenerator", () => {
	const mockGenerator = createMockGenerator<TestType>({
		generator: ({ seed }) => {
			return {
				id: seed ?? 1,
				name: `Test ${seed ?? 1}`,
			};
		},
	});

	describe("single", () => {
		it("should generate a single record", () => {
			const result = mockGenerator.single();
			expect(result).toBeDefined();
			expect(typeof result.id).toBe("number");
			expect(typeof result.name).toBe("string");
		});

		it("should apply overrides correctly", () => {
			const result = mockGenerator.single({ name: "Override" });
			expect(result.name).toBe("Override");
		});
	});

	describe("many", () => {
		it("should generate multiple records", () => {
			const count = 3;
			const results = mockGenerator.many(count);
			expect(results).toHaveLength(count);
			results.forEach((result) => {
				expect(result).toBeDefined();
				expect(typeof result.id).toBe("number");
				expect(typeof result.name).toBe("string");
			});
		});

		it("should generate unique records", () => {
			const results = mockGenerator.many(3);
			const ids = new Set(results.map((r) => r.id));
			expect(ids.size).toBe(3);
		});

		it("should apply overrides to all records", () => {
			const results = mockGenerator.many(3, { name: "Same" });
			expect(results.every((r) => r.name === "Same")).toBe(true);
		});
	});

	describe("seeded", () => {
		it("should generate deterministic single record", () => {
			const result1 = mockGenerator.seeded(123);
			const result2 = mockGenerator.seeded(123);
			expect(result1).toEqual(result2);
		});

		it("should generate deterministic multiple records", () => {
			const results1 = mockGenerator.seeded(123, 3);
			const results2 = mockGenerator.seeded(123, 3);
			expect(Array.isArray(results1)).toBe(true);
			expect(Array.isArray(results2)).toBe(true);
			expect(results1).toEqual(results2);
		});

		it("should apply overrides while maintaining determinism", () => {
			const result1 = mockGenerator.seeded(123, 1, {
				name: "Override",
			});
			const result2 = mockGenerator.seeded(123, 1, {
				name: "Override",
			});
			expect(result1).toEqual(result2);
			if (!Array.isArray(result1)) {
				expect(result1.name).toBe("Override");
			}
		});
	});
});
