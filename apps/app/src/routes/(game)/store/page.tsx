import { useQuery } from "@tanstack/react-query";
import { serverLoader } from "src/utils/server-loader";

import { useSearch } from "@repo/ds/hooks/use-search";
import { useTranslation } from "@repo/ds/lib/localization";

import { metadata, paginationSchema } from "@repo/domains/app";
import { StoreCard } from "@repo/domains/store";

import { trpc } from "@repo/domains";

export const loader = serverLoader(async ({ getTranslations }) => {
	const [t] = await Promise.all([getTranslations("store")]);

	return { t: { title: t("title") } };
});

export const meta = metadata<typeof loader>(({ data }) => ({
	title: data?.t.title,
}));

export default function StorePage() {
	const { t } = useTranslation("store");
	const [pagination] = useSearch(paginationSchema);
	const { data: storeItems } = useQuery(
		trpc.store.available.queryOptions(pagination),
	);

	return (
		<div className="p-2 bg-pattern grow z-1">
			<h1 className="text-2xl font-bold mb-4 mt-10">{t("title")}</h1>

			<div className="flex flex-wrap gap-4">
				{storeItems?.[0]?.map((item) => (
					<StoreCard item={item} key={item.id} />
				))}
			</div>
		</div>
	);
}
