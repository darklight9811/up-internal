import { c } from "../../../utils/db/columns";

export const userType = c.enum("user_types", ["user", "admin", "dev"]);

export const users = c.table("users", {
	id: c.id().defaultRandom().primaryKey(),

	type: userType().default("user").notNull(),
	name: c.varchar().notNull().unique(),
	image: c.varchar(),
	email: c.varchar().notNull().unique(),
	emailVerified: c.boolean().default(false).notNull(),
	isAnonymous: c.boolean().default(false).notNull(),
	socialNumber: c.varchar().notNull().unique(),

	createdAt: c.timestamp().notNull().defaultNow(),
	updatedAt: c.timestamp(),
});
