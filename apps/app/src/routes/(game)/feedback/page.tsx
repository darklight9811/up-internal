import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { serverLoader } from "src/utils/server-loader";

import { Submit } from "@repo/ds/hooks/use-form";
import { useTranslation } from "@repo/ds/lib/localization";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@repo/ds/ui/dialog";

import { metadata } from "@repo/domains/app";
import { FeedbackForm } from "@repo/domains/feedbacks";

import { trpc } from "@repo/domains";

export const loader = serverLoader(async ({ getTranslations }) => {
	const t = await getTranslations();

	return { t: { title: t("feedback.title") } };
});

export const meta = metadata<typeof loader>(({ data }) => ({
	title: data?.t.title,
}));

export default function FeedbackPage() {
	const navigate = useNavigate();
	const { t } = useTranslation();
	const { mutateAsync: submit, error } = useMutation(
		trpc.feedbacks.store.mutationOptions({
			onSuccess(result) {
				if (result) {
					navigate("/");
					toast(t("feedback.success"));
				}
			},
		}),
	);

	return (
		<Dialog open onOpenChange={() => navigate("/")}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{t("feedback.title")}</DialogTitle>
					<DialogDescription>
						{t("feedback.description")}
					</DialogDescription>
				</DialogHeader>

				<FeedbackForm onSubmit={submit} errors={error}>
					<Submit className="w-full">{t("feedback.submit")}</Submit>
				</FeedbackForm>
			</DialogContent>
		</Dialog>
	);
}
