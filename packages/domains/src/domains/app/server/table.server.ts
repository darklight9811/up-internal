import { c } from "../../../utils/db/columns";

export const keyValues = c.table("key_values", {
	id: c.id().defaultRandom().primaryKey(),
	key: c.text(),
	value: c.json(),
});
