import type { PaginationSchema } from "../../app";
import type { UserSystemSchema } from "../../users/schema";
import { type PartyFormSchema, type PartyMemberFormSchema, permissions } from "../schema";
import { partiesSQL } from "./sql.server";

export const partiesService = {
	index(pagination: PaginationSchema, user: UserSystemSchema) {
		return partiesSQL.index(pagination, user);
	},

	store(data: PartyFormSchema, user: UserSystemSchema) {
		return partiesSQL.store(data, user);
	},

	async show(id: string, user?: UserSystemSchema) {
		return partiesSQL.show(id, user);
	},

	async update(id: string, data: PartyFormSchema, user: UserSystemSchema) {
		await partiesSQL.members.can(id, user.id, permissions.canManage);

		return partiesSQL.update(id, data);
	},

	async delete(id: string, user: UserSystemSchema) {
		await partiesSQL.members.can(id, user.id, permissions.canDelete);

		return partiesSQL.delete(id);
	},

	members: {
		async index(party: string, pagination: PaginationSchema, user: UserSystemSchema) {
			await partiesSQL.members.can(party, user.id, permissions.canView);

			return partiesSQL.members.index(party, pagination);
		},

		async request(party: string, user: UserSystemSchema) {
			return partiesSQL.members.request(party, user);
		},

		async add(party: string, data: PartyMemberFormSchema, user: UserSystemSchema) {
			await partiesSQL.members.can(party, user.id, permissions.canManage);

			return partiesSQL.members.add(party, data, user);
		},

		show(party: string, user: string) {
			return partiesSQL.members.show(party, user);
		},

		async update(party: string, member: string, data: PartyMemberFormSchema, user: UserSystemSchema) {
			await partiesSQL.members.can(party, user.id, permissions.canManage);

			return partiesSQL.members.update(member, data);
		},

		async remove(party: string, member: string, user: UserSystemSchema) {
			await partiesSQL.members.can(party, user.id, permissions.canManage);

			return partiesSQL.members.remove(member);
		},
	},
};
