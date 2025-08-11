import { c } from "../../../utils/db/columns";
import { users } from "../../users/server/table.server";

export const parties = c.table("parties", {
	id: c.id().defaultRandom().primaryKey(),

	slug: c.text().unique(),
	name: c.text().notNull(),
	description: c.text(),
	location: c.geometry({ type: "point", mode: "tuple", srid: 4326 }),

	userCreatedId: c
		.id("userCreatedId")
		.references(() => users.id, { onDelete: "cascade" })
		.notNull(),

	...c.stamp(),
});

export const partiesRelations = c.relations(parties, ({ one }) => ({
	userCreated: one(users, {
		fields: [parties.userCreatedId],
		references: [users.id],
	}),
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
