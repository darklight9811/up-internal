import { db } from "../../../utils/db";
import { auth } from "../helpers/auth.server";

export const authService = {
	session(token?: string | Headers | null) {
		if (!token) return null;

		return auth.api
			.getSession({
				headers:
					typeof token === "string"
						? new Headers({ Authorization: `Bearer ${token}` })
						: token,
			})
			.then((t) =>
				t?.user
					? db.query.users.findFirst({
							where: (table, { eq }) => eq(table.id, t.user.id),
						})
					: null,
			)
			.catch(() => null);
	},

	async logout(token?: string | Headers | null) {
		if (!token) return null;

		const response = await auth.api.signOut({
			headers:
				typeof token === "string"
					? new Headers({ Authorization: `Bearer ${token}` })
					: token,
		});

		return response;
	},
};
