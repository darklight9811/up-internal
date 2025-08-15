import { and, count, eq, inArray, or } from "drizzle-orm";

import { db } from "../../../utils/db";
import { bitwise } from "../../../utils/db/columns";
import type { PaginationSchema } from "../../app";
import type { UserSystemSchema } from "../../users/schema";
import { type PartyFormSchema, type PartyMemberFormSchema, permissions } from "../schema";
import { parties, partyMembers } from "./table.server";

export const partiesSQL = {
	index(pagination: PaginationSchema, user: UserSystemSchema) {
		const whereClause = inArray(
			parties.id,
			db
				.select({ id: partyMembers.partyId })
				.from(partyMembers)
				.where(and(eq(partyMembers.userId, user.id), bitwise.has(partyMembers.role, permissions.canView))),
		);

		return Promise.all([
			db.query.parties.findMany({
				limit: pagination.limit,
				offset: pagination.limit * (pagination.page - 1),
				orderBy: (table, { desc }) => [desc(table.createdAt)],
				where: whereClause,
			}),
			db
				.select({ count: count() })
				.from(parties)
				.limit(pagination.limit)
				.offset(pagination.limit * (pagination.page - 1))
				.where(whereClause)
				.then((response) => ({
					...pagination,
					items: response[0].count,
					pages: Math.ceil(response[0].count / pagination.limit),
				})),
		]);
	},

	store(payload: PartyFormSchema, user: UserSystemSchema) {
		return db.insert(parties).values({
			slug: payload.slug,
			name: payload.name,
			description: payload.description,
			location: payload.location,
			userCreatedId: user.id,
		});
	},

	show(id: string) {
		return db.query.parties.findFirst({
			where: or(eq(parties.id, id), eq(parties.slug, id)),
		});
	},

	update(id: string, payload: PartyFormSchema) {
		return db
			.update(parties)
			.set(payload)
			.where(or(eq(parties.id, id), eq(parties.slug, id)));
	},

	delete(id: string) {
		return db.delete(parties).where(or(eq(parties.id, id), eq(parties.slug, id)));
	},

	members: {
		can(party: string, user: string, permission: number) {
			return db
				.select({ id: partyMembers.id })
				.from(partyMembers)
				.where(
					and(
						eq(partyMembers.partyId, party),
						eq(partyMembers.userId, user),
						bitwise.has(partyMembers.role, permission),
					),
				);
		},

		index(party: string, pagination: PaginationSchema) {
			return Promise.all([
				db.query.partyMembers.findMany({
					limit: pagination.limit,
					offset: pagination.limit * (pagination.page - 1),
					orderBy: (table, { desc }) => [desc(table.createdAt)],
					where: eq(partyMembers.partyId, party),
				}),
				db
					.select({ count: count() })
					.from(partyMembers)
					.limit(pagination.limit)
					.offset(pagination.limit * (pagination.page - 1))
					.where(eq(partyMembers.partyId, party))
					.then((response) => ({
						...pagination,
						items: response[0].count,
						pages: Math.ceil(response[0].count / pagination.limit),
					})),
			]);
		},

		async request(party: string, user: UserSystemSchema) {
			return db.insert(partyMembers).values({ role: 0, userId: user.id, partyId: party });
		},

		add(party: string, data: PartyMemberFormSchema, user: UserSystemSchema) {
			return db.insert(partyMembers).values({ ...data, userId: user.id, partyId: party });
		},

		show(party: string, user: string) {
			return db
				.select()
				.from(partyMembers)
				.where(and(eq(partyMembers.partyId, party), eq(partyMembers.userId, user)))
				.then((t) => t[0]);
		},

		update(member: string, data: PartyMemberFormSchema) {
			return db
				.update(partyMembers)
				.set({
					role: data.role,
				})
				.where(eq(partyMembers.id, member));
		},

		remove(member: string) {
			return db.delete(partyMembers).where(eq(partyMembers.id, member));
		},
	},
};
