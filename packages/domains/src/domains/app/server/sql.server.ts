import { eq } from "drizzle-orm";

import { db } from "../../../utils/db";
import { keyValues } from "./table.server";

export const appSQL = {
	/**
	 * Get a key-value pair by key
	 */
	async getKeyValue(key: string) {
		const result = await db
			.select()
			.from(keyValues)
			.where(eq(keyValues.key, key))
			.limit(1);

		return result[0];
	},

	/**
	 * Create or update a key-value pair
	 */
	async setKeyValue(key: string, value: unknown) {
		const result = await db
			.insert(keyValues)
			.values({
				key,
				value,
			})
			.onConflictDoUpdate({
				target: keyValues.key,
				set: {
					value,
				},
			})
			.returning();

		return result[0];
	},

	/**
	 * Delete a key-value pair
	 */
	async deleteKeyValue(key: string) {
		const result = await db
			.delete(keyValues)
			.where(eq(keyValues.key, key))
			.returning();

		return result[0];
	},
};
