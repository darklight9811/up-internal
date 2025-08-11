import { TRPCError } from "@trpc/server";

import type { PaginationSchema } from "../../app/schema";
import { auth } from "../../auth/helpers/auth.server";
import type { UserFormSchema, UserSchema } from "../schema";
import { userSQL } from "./sql.server";

export const userService = {
	index(pagination: PaginationSchema) {
		return userSQL.index(pagination);
	},

	show(id: string) {
		return userSQL.show(id);
	},

	update(id: string, payload: UserFormSchema, user: UserSchema) {
		if (user.type === "user" && user.id !== id) {
			throw new TRPCError({
				code: "FORBIDDEN",
				message: "You can only update your own user profile.",
			});
		}

		return auth.api.updateUser({
			body: {
				...payload,
				image: payload.image || undefined,
			},
		});
	},

	delete(id: string, user: UserSchema) {
		if (user.type === "user" && user.id !== id) {
			throw new TRPCError({
				code: "FORBIDDEN",
				message: "You can only update your own user profile.",
			});
		}

		return userSQL.delete(id);
	},
};
