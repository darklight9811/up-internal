import { useMutation, useQuery } from "@tanstack/react-query";
import { ChevronLeftIcon } from "lucide-react";
import { useMemo } from "react";
import { Link, useParams } from "react-router";
import { serverLoader } from "src/utils/server-loader";

import { Thumbnail } from "@repo/ds/3d/thumbnail";
import { Submit } from "@repo/ds/hooks/use-form";
import { ScrapIcon } from "@repo/ds/icons/scrap-icon";
import { TicketIcon } from "@repo/ds/icons/ticket-icon";
import { useTranslation } from "@repo/ds/lib/localization";
import { formatNumber } from "@repo/ds/lib/math";
import { buttonVariants } from "@repo/ds/ui/button";

import { metadata, queryClient } from "@repo/domains/app";
import { PurchaseForm } from "@repo/domains/store";

import { trpc } from "@repo/domains";

export const loader = serverLoader(async ({ getTranslations, params }) => {
	const [t] = await Promise.all([getTranslations("store")]);

	return { t: { title: t(`items.${params.slug}.name`) } };
});

export const meta = metadata<typeof loader>(({ data }) => ({
	title: data?.t.title,
}));

export default function StoreItemPage() {
	const { t } = useTranslation("store");

	const { slug } = useParams<{ slug: string }>();
	const { data: item } = useQuery(trpc.store.item.queryOptions(slug!));
	const { data: resources } = useQuery(trpc.resources.index.queryOptions());

	const { mutateAsync: purchaseItem } = useMutation(
		trpc.store.purchase.mutationOptions({
			onSuccess(data) {
				if (data)
					Promise.all([
						queryClient.invalidateQueries(
							trpc.store.item.queryFilter(),
						),
						queryClient.invalidateQueries(
							trpc.store.purchases.queryFilter(),
						),
						queryClient.invalidateQueries(
							trpc.store.available.queryFilter(),
						),
					]);
			},
		}),
	);

	const canPurchase = useMemo(() => {
		if (!item || !resources) return false;

		return (
			(resources.find((r) => r.type === item.cost[0].resource)?.storage
				.currentQuantity || 0) >= item.cost[0].amount
		);
	}, [item, resources]);

	if (!item) return null;

	return (
		<main>
			<Thumbnail
				src={item.thumbnail}
				className="rounded-t-none aspect-video"
			/>

			<div className="p-2">
				<h1 className="text-2xl font-bold mt-4 flex gap-2 items-center">
					<Link
						to="/store"
						className={buttonVariants({ size: "icon" })}
					>
						<ChevronLeftIcon />
					</Link>
					{t(`items.${item.slug}.name`, { defaultValue: item.slug })}
				</h1>

				<div className="my-2">
					{item.cost.map((cost) => (
						<div key={cost.resource} className="flex gap-1">
							{cost.resource === "gold" ? (
								<ScrapIcon />
							) : (
								<TicketIcon className="text-transparent" />
							)}
							{formatNumber(cost.amount)}
						</div>
					))}
				</div>

				<p className="my-4">
					{t(`items.${item.slug}.description`, { defaultValue: "" })}
				</p>

				<PurchaseForm onSubmit={purchaseItem} itemId={item.id}>
					<Submit
						size="lg"
						disabled={!!item.purchased || !canPurchase}
						className="w-full"
					>
						{t(
							item.purchased
								? "already-purchased"
								: canPurchase
									? "purchase"
									: "cant-purchase",
						)}
					</Submit>
				</PurchaseForm>
			</div>
		</main>
	);
}
