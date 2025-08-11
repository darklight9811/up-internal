import { drizzle } from "drizzle-orm/bun-sql";

// schemas
import * as appTables from "../../domains/app/server/table.server";
import * as feedbacksTables from "../../domains/feedbacks/server/table.server";
import * as highscoreTables from "../../domains/highscore/server/table.server";
import * as resourcesTables from "../../domains/resources/server/table.server";
import * as runsTables from "../../domains/runs/server/table.server";
import * as storeTables from "../../domains/store/server/table.server";
import * as upgradesTables from "../../domains/upgrades/server/table.server";
import * as usersTables from "../../domains/users/server/table.server";

export const db = drizzle({
	connection: process.env.DATABASE_URL as string,
	schema: {
		...usersTables,
		...resourcesTables,
		...highscoreTables,
		...feedbacksTables,
		...runsTables,
		...storeTables,
		...appTables,
		...upgradesTables,
	},
});
