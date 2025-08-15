import { c } from "../../../utils/db/columns";
import { cores } from "../../cores/server/table.server";
import { users } from "../../users/server/table.server";

export const parties = c.table("parties", {
	id: c.id().defaultRandom().primaryKey(),

	logo: c.varchar(),
	slug: c.text().unique().notNull(),
	name: c.text().notNull().notNull(),
	description: c.text(),
	location: c.geometry({ type: "point", mode: "tuple", srid: 4326 }),

	userCreatedId: c
		.id("userCreatedId")
		.references(() => users.id, { onDelete: "cascade" })
		.notNull(),

	...c.stamp(),
});

export const partiesRelations = c.relations(parties, ({ one, many }) => ({
	userCreated: one(users, {
		fields: [parties.userCreatedId],
		references: [users.id],
	}),
	members: many(partyMembers),
	cores: many(cores),
}));

export const partyMembers = c.table("party_members", {
	id: c.id().defaultRandom().primaryKey(),

	role: c.int().notNull().default(0),

	partyId: c
		.id("partyId")
		.references(() => parties.id, { onDelete: "cascade" })
		.notNull(),

	userId: c
		.id("userId")
		.references(() => users.id, { onDelete: "cascade" })
		.notNull(),

	...c.stamp(),
});

export const partyMemberRelations = c.relations(partyMembers, ({ one }) => ({
	party: one(parties, {
		fields: [partyMembers.partyId],
		references: [parties.id],
	}),
	user: one(users, {
		fields: [partyMembers.userId],
		references: [users.id],
	}),
}));
