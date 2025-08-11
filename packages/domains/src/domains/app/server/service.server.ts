import { appSQL } from "./sql.server";

export const keyValueService = {
	get(id: string) {
		return appSQL.getKeyValue(id);
	},
	set(id: string, value: unknown) {
		return appSQL.setKeyValue(id, value);
	},
	delete(id: string) {
		return appSQL.deleteKeyValue(id);
	},
};
