import { drizzle } from "drizzle-orm/postgres-js";

// schemas
import * as appTables from "../../domains/app/server/table.server";
import * as partyTables from "../../domains/parties/server/table.server";
import * as usersTables from "../../domains/users/server/table.server";

export const db = drizzle({
	connection: process.env.DATABASE_URL as string,
	schema: {
		...usersTables,
		...partyTables,
		...appTables,
	},
});
