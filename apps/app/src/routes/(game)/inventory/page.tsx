import { useQuery } from "@tanstack/react-query";
import { serverLoader } from "src/utils/server-loader";

import { useTranslation } from "@repo/ds/lib/localization";

import { metadata } from "@repo/domains/app";
import { InventoryCard } from "@repo/domains/store";

import { trpc } from "@repo/domains";

export const loader = serverLoader(async ({ getTranslations }) => {
	const [t] = await Promise.all([getTranslations("store")]);

	return { t: { title: t("inventory") } };
});

export const meta = metadata<typeof loader>(({ data }) => ({
	title: data?.t.title,
}));

export default function InventoryPage() {
	const { t } = useTranslation("store");

	const { data: purchases } = useQuery(trpc.store.purchases.queryOptions());

	return (
		<div className="p-2 bg-pattern grow z-1">
			<h1 className="text-2xl font-bold mb-4 mt-10">{t("inventory")}</h1>

			<div className="flex flex-wrap gap-4">
				{purchases?.[0].map((purchase) => (
					<InventoryCard key={purchase.id} item={purchase} />
				))}
			</div>
		</div>
	);
}
