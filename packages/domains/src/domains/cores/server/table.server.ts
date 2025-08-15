import { c } from "../../../utils/db/columns";
import { parties } from "../../parties/server/table.server";
import { users } from "../../users/server/table.server";

export const cores = c.table("cores", {
	id: c.id().defaultRandom().primaryKey(),

	name: c.text().notNull(),
	description: c.text(),
	location: c.geometry({ type: "point", mode: "tuple", srid: 4326 }),

	partyId: c
		.id("partyId")
		.references(() => parties.id, { onDelete: "cascade" })
		.notNull(),

	userCreatedId: c
		.id("userCreatedId")
		.references(() => users.id, { onDelete: "cascade" })
		.notNull(),

	...c.stamp(),
});

export const coresRelations = c.relations(cores, ({ one, many }) => ({
	party: one(parties, {
		fields: [cores.partyId],
		references: [parties.id],
	}),
	userCreated: one(users, {
		fields: [cores.userCreatedId],
		references: [users.id],
	}),
	members: many(coreMembers),
}));

export const coreMembers = c.table("core_members", {
	id: c.id().defaultRandom().primaryKey(),

	coreId: c
		.id("coreId")
		.references(() => cores.id, { onDelete: "cascade" })
		.notNull(),

	userId: c
		.id("userId")
		.references(() => users.id, { onDelete: "cascade" })
		.notNull(),

	...c.stamp(),
});

export const coreMemberRelations = c.relations(coreMembers, ({ one }) => ({
	core: one(cores, {
		fields: [coreMembers.coreId],
		references: [cores.id],
	}),
	user: one(users, {
		fields: [coreMembers.userId],
		references: [users.id],
	}),
}));
