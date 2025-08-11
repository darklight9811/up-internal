import { cuid2 } from "drizzle-cuid2/postgres";
import { relations, sql } from "drizzle-orm";
import {
	boolean,
	geometry,
	integer,
	json,
	type PgColumn,
	pgEnum,
	pgTableCreator,
	text,
	timestamp,
	varchar,
} from "drizzle-orm/pg-core";

export const table = pgTableCreator((n) => n);

export const c = {
	table,
	id: (id = "id") => cuid2(id),
	varchar,
	text,
	boolean,
	timestamp,
	enum: pgEnum,
	json: json,
	int: integer,
	relations,
	geometry,
	stamp: () => ({
		createdAt: timestamp().notNull().defaultNow(),
		updatedAt: timestamp(),
	}),
};

export const bitwise = {
	has: (column: PgColumn, value: number) =>
		sql`(${column} & ${value}) = ${value}`,
};
