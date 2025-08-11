import { beforeEach, describe, expect, it, jest, mock } from "bun:test";

// Test utilities
const mockKeyValue = {
	id: "test-key-value-id",
	key: "test-key",
	value: { data: "test-value" },
};

// Mock the SQL module before importing the service
const mockAppSQL = {
	getKeyValue:
		mock<(key: string) => Promise<typeof mockKeyValue | undefined>>(),
	setKeyValue:
		mock<
			(
				key: string,
				value: unknown,
			) => Promise<typeof mockKeyValue | undefined>
		>(),
	deleteKeyValue:
		mock<(key: string) => Promise<typeof mockKeyValue | undefined>>(),
};

// Mock the entire SQL module
mock.module("./sql.server", () => ({
	appSQL: mockAppSQL,
}));

// Import the service after mocking
import { keyValueService } from "./service.server";

describe("keyValueService", () => {
	const mockKeyValue = {
		id: "test-key-value-id",
		key: "test-key",
		value: { data: "test-value" },
	};

	beforeEach(() => {
		// Reset all mocks before each test
		jest.clearAllMocks();
	});

	describe("get", () => {
		it("should retrieve a key-value pair by key", async () => {
			// Mock: get returns a key-value pair
			mockAppSQL.getKeyValue.mockResolvedValue(mockKeyValue);

			// Test getting a key-value
			const result = await keyValueService.get("test-key");

			// Verify the result
			expect(result).toBeDefined();
			expect(result).toBe(mockKeyValue);
			expect(result.key).toBe("test-key");
			expect(result.value).toEqual({ data: "test-value" });

			// Verify SQL method was called correctly
			expect(mockAppSQL.getKeyValue).toHaveBeenCalledWith("test-key");
		});

		it("should handle non-existent key", async () => {
			// Mock: get returns undefined for non-existent key
			mockAppSQL.getKeyValue.mockResolvedValue(undefined);

			// Test getting a non-existent key
			const result = await keyValueService.get("non-existent-key");

			// Verify the result is undefined
			expect(result).toBeUndefined();

			// Verify SQL method was called correctly
			expect(mockAppSQL.getKeyValue).toHaveBeenCalledWith(
				"non-existent-key",
			);
		});
	});

	describe("set", () => {
		it("should create a new key-value pair", async () => {
			const newKeyValue = {
				...mockKeyValue,
				key: "new-key",
				value: { data: "new-value" },
			};

			// Mock: set returns the new key-value pair
			mockAppSQL.setKeyValue.mockResolvedValue(newKeyValue);

			// Test setting a new key-value
			const result = await keyValueService.set("new-key", {
				data: "new-value",
			});

			// Verify the result
			expect(result).toBeDefined();
			expect(result).toBe(newKeyValue);
			expect(result.key).toBe("new-key");
			expect(result.value).toEqual({ data: "new-value" });

			// Verify SQL method was called correctly
			expect(mockAppSQL.setKeyValue).toHaveBeenCalledWith("new-key", {
				data: "new-value",
			});
		});

		it("should update an existing key-value pair", async () => {
			const updatedKeyValue = {
				...mockKeyValue,
				value: { data: "updated-value" },
			};

			// Mock: set returns the updated key-value pair
			mockAppSQL.setKeyValue.mockResolvedValue(updatedKeyValue);

			// Test updating an existing key-value
			const result = await keyValueService.set("test-key", {
				data: "updated-value",
			});

			// Verify the result
			expect(result).toBeDefined();
			expect(result).toBe(updatedKeyValue);
			expect(result.key).toBe("test-key");
			expect(result.value).toEqual({ data: "updated-value" });

			// Verify SQL method was called correctly
			expect(mockAppSQL.setKeyValue).toHaveBeenCalledWith("test-key", {
				data: "updated-value",
			});
		});
	});

	describe("delete", () => {
		it("should delete an existing key-value pair", async () => {
			// Mock: delete returns the deleted key-value pair
			mockAppSQL.deleteKeyValue.mockResolvedValue(mockKeyValue);

			// Test deleting a key-value
			const result = await keyValueService.delete("test-key");

			// Verify the result
			expect(result).toBeDefined();
			expect(result).toBe(mockKeyValue);
			expect(result.key).toBe("test-key");

			// Verify SQL method was called correctly
			expect(mockAppSQL.deleteKeyValue).toHaveBeenCalledWith("test-key");
		});

		it("should handle non-existent key deletion", async () => {
			// Mock: delete returns undefined for non-existent key
			mockAppSQL.deleteKeyValue.mockResolvedValue(undefined);

			// Test deleting a non-existent key
			const result = await keyValueService.delete("non-existent-key");

			// Verify the result is undefined
			expect(result).toBeUndefined();

			// Verify SQL method was called correctly
			expect(mockAppSQL.deleteKeyValue).toHaveBeenCalledWith(
				"non-existent-key",
			);
		});
	});

	describe("error handling", () => {
		it("should handle SQL errors in get", async () => {
			const error = new Error("Database connection failed");

			// Mock SQL error
			mockAppSQL.getKeyValue.mockRejectedValue(error);

			// Test that error is propagated
			await expect(keyValueService.get("test-key")).rejects.toThrow(
				"Database connection failed",
			);
		});

		it("should handle SQL errors in set", async () => {
			const error = new Error("Database constraint violation");

			// Mock SQL error
			mockAppSQL.setKeyValue.mockRejectedValue(error);

			// Test that error is propagated
			await expect(
				keyValueService.set("test-key", { data: "test" }),
			).rejects.toThrow("Database constraint violation");
		});

		it("should handle SQL errors in delete", async () => {
			const error = new Error("Database connection failed");

			// Mock SQL error
			mockAppSQL.deleteKeyValue.mockRejectedValue(error);

			// Test that error is propagated
			await expect(keyValueService.delete("test-key")).rejects.toThrow(
				"Database connection failed",
			);
		});
	});
});
