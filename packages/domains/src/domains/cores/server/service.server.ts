import type { PaginationSchema } from "../../app";
import { permissions } from "../../parties/schema";
import type { UserSystemSchema } from "../../users/schema";
import type { CoreFormSchema, CoreMemberFormSchema } from "../schema";
import { coresSQL } from "./sql.server";

export const coresService = {
	index(party: string | undefined, pagination: PaginationSchema, user: UserSystemSchema) {
		return coresSQL.index(party, pagination, user);
	},

	store(data: CoreFormSchema, user: UserSystemSchema) {
		return coresSQL.store(data, user);
	},

	async show(id: string) {
		return coresSQL.show(id);
	},

	async update(id: string, data: CoreFormSchema, user: UserSystemSchema) {
		return coresSQL.update(id, data);
	},

	async delete(id: string, user: UserSystemSchema) {
		await coresSQL.members.can(id, user.id, permissions.canDelete);

		return coresSQL.delete(id);
	},

	members: {
		async index(party: string, pagination: PaginationSchema, user: UserSystemSchema) {
			await coresSQL.members.can(party, user.id, permissions.canView);

			return coresSQL.members.index(party, pagination);
		},

		async request(party: string, user: UserSystemSchema) {
			return coresSQL.members.request(party, user);
		},

		async add(party: string, data: CoreMemberFormSchema, user: UserSystemSchema) {
			await coresSQL.members.can(party, user.id, permissions.canManage);

			return coresSQL.members.add(party, data, user);
		},

		async remove(party: string, member: string, user: UserSystemSchema) {
			await coresSQL.members.can(party, user.id, permissions.canManage);

			return coresSQL.members.remove(member);
		},
	},
};
