import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { serverLoader } from "src/utils/server-loader";

import { Submit, useAppForm } from "@repo/ds/hooks/use-form";
import { useTranslation } from "@repo/ds/lib/localization";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@repo/ds/ui/accordion";

import { metadata } from "@repo/domains/app";

import { trpc } from "@repo/domains";

export const loader = serverLoader(async ({ getTranslations }) => {
	const t = await getTranslations("auth");

	return {
		t: {
			title: t("register"),
		},
	};
});

export const meta = metadata<typeof loader>(({ data }) => ({
	title: data?.t.title,
}));

export default function AnonymousPage() {
	const navigate = useNavigate();
	const { t } = useTranslation("auth");
	const { mutateAsync: register } = useMutation(
		trpc.auth.anonymous.mutationOptions({
			onSuccess(data) {
				if (data) navigate("/");
			},
		}),
	);
	const form = useAppForm({
		onSubmit: () => register(),
	});

	return (
		<div className="flex flex-col items-center gap-4 text-center text-xs">
			<p>{t("anonymous-confirm")}</p>

			<form.Form form={form} className="w-full max-w-sm">
				<Submit className="w-full" size="lg">
					{t("confirm")}
				</Submit>
			</form.Form>

			<Accordion type="single" collapsible className="w-full">
				<AccordionItem value="1">
					<AccordionTrigger>{t("cookies-title")}</AccordionTrigger>
					<AccordionContent>
						<p className="text-xs text-justify">
							{t("cookies-description")}
						</p>
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</div>
	);
}
