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
		await coresSQL.members.can(id, permissions.canManage, user);

		return coresSQL.update(id, data);
	},

	async delete(id: string, user: UserSystemSchema) {
		await coresSQL.members.can(id, permissions.canDelete, user);

		return coresSQL.delete(id);
	},

	members: {
		async index(core: string, pagination: PaginationSchema, user: UserSystemSchema) {
			await coresSQL.members.can(core, permissions.canView, user);

			return coresSQL.members.index(core, pagination);
		},

		async request(core: string, user: UserSystemSchema) {
			return coresSQL.members.request(core, user);
		},

		async add(core: string, data: CoreMemberFormSchema, user: UserSystemSchema) {
			await coresSQL.members.can(core, permissions.canManage, user);

			return coresSQL.members.add(core, data, user);
		},

		async remove(core: string, member: string, user: UserSystemSchema) {
			await coresSQL.members.can(core, permissions.canManage, user);

			return coresSQL.members.remove(member);
		},
	},
};
