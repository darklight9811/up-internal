import type { PaginationSchema } from "../../app";
import type { UserSystemSchema } from "../../users/schema";
import { type PartyFormSchema, type PartyMemberFormSchema, permissions } from "../schema";
import { partyMemberSQL } from "./sql.server";

export const partyService = {
	index(pagination: PaginationSchema, user: UserSystemSchema) {
		return partyMemberSQL.index(pagination, user);
	},

	store(data: PartyFormSchema, user: UserSystemSchema) {
		return partyMemberSQL.store(data, user);
	},

	async show(id: string) {
		return partyMemberSQL.show(id);
	},

	async update(id: string, data: PartyFormSchema, user: UserSystemSchema) {
		await partyMemberSQL.members.can(id, user.id, permissions.canManage);

		return partyMemberSQL.update(id, data);
	},

	async delete(id: string, user: UserSystemSchema) {
		await partyMemberSQL.members.can(id, user.id, permissions.canDelete);

		return partyMemberSQL.delete(id);
	},

	members: {
		async index(party: string, pagination: PaginationSchema, user: UserSystemSchema) {
			await partyMemberSQL.members.can(party, user.id, permissions.canView);

			return partyMemberSQL.members.index(party, pagination);
		},

		async request(party: string, user: UserSystemSchema) {
			return partyMemberSQL.members.request(party, user);
		},

		async add(party: string, data: PartyMemberFormSchema, user: UserSystemSchema) {
			await partyMemberSQL.members.can(party, user.id, permissions.canManage);

			return partyMemberSQL.members.add(party, data, user);
		},

		async update(party: string, member: string, data: PartyMemberFormSchema, user: UserSystemSchema) {
			await partyMemberSQL.members.can(party, user.id, permissions.canManage);

			return partyMemberSQL.members.update(member, data);
		},

		async remove(party: string, member: string, user: UserSystemSchema) {
			await partyMemberSQL.members.can(party, user.id, permissions.canManage);

			return partyMemberSQL.members.remove(member);
		},
	},
};
