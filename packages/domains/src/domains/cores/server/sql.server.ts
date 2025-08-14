import { and, count, eq, inArray } from "drizzle-orm";

import { db } from "../../../utils/db";
import { bitwise } from "../../../utils/db/columns";
import type { PaginationSchema } from "../../app";
import { permissions } from "../../parties/schema";
import { parties, partyMembers } from "../../parties/server/table.server";
import type { UserSystemSchema } from "../../users/schema";
import type { CoreFormSchema, CoreMemberFormSchema } from "../schema";
import { coreMembers, cores } from "./table.server";

export const coresSQL = {
	index(party: string | undefined, pagination: PaginationSchema, user: UserSystemSchema) {
		const whereClause = and(
			inArray(
				cores.partyId,
				db
					.select({ id: partyMembers.partyId })
					.from(partyMembers)
					.where(and(eq(partyMembers.userId, user.id), bitwise.has(partyMembers.role, permissions.canView))),
			),
			party ? eq(cores.partyId, party) : undefined,
		);

		return Promise.all([
			db.query.cores.findMany({
				limit: pagination.limit,
				offset: pagination.limit * (pagination.page - 1),
				orderBy: (table, { desc }) => [desc(table.createdAt)],
				where: whereClause,
			}),
			db
				.select({ count: count() })
				.from(cores)
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

	store(payload: CoreFormSchema, user: UserSystemSchema) {
		return db
			.insert(cores)
			.values({
				name: payload.name,
				description: payload.description,
				partyId: payload.partyId,
				location: payload.location,
				userCreatedId: user.id,
			})
			.returning()
			.then((response) => response[0]);
	},

	show(id: string) {
		return db.query.cores.findFirst({
			where: eq(cores.id, id),
		});
	},

	update(id: string, payload: CoreFormSchema) {
		return db.update(cores).set(payload).where(eq(cores.id, id));
	},

	delete(id: string) {
		return db.delete(cores).where(eq(cores.id, id));
	},

	members: {
		can(party: string, user: string, permission: number) {
			return db
				.select({ id: coreMembers.id })
				.from(parties)
				.where(
					and(
						eq(coreMembers.coreId, party),
						eq(coreMembers.userId, user),
						bitwise.has(partyMembers.role, permission),
					),
				);
		},

		index(core: string, pagination: PaginationSchema) {
			return Promise.all([
				db.query.coreMembers.findMany({
					limit: pagination.limit,
					offset: pagination.limit * (pagination.page - 1),
					orderBy: (table, { desc }) => [desc(table.createdAt)],
					where: eq(coreMembers.coreId, core),
				}),
				db
					.select({ count: count() })
					.from(coreMembers)
					.limit(pagination.limit)
					.offset(pagination.limit * (pagination.page - 1))
					.where(eq(coreMembers.coreId, core))
					.then((response) => ({
						...pagination,
						items: response[0].count,
						pages: Math.ceil(response[0].count / pagination.limit),
					})),
			]);
		},

		async request(party: string, user: UserSystemSchema) {
			return db.insert(coreMembers).values({ userId: user.id, partyId: party });
		},

		add(party: string, data: CoreMemberFormSchema, user: UserSystemSchema) {
			return db.insert(coreMembers).values({ ...data, userId: user.id, partyId: party });
		},

		remove(member: string) {
			return db.delete(coreMembers).where(eq(coreMembers.id, member));
		},
	},
};
