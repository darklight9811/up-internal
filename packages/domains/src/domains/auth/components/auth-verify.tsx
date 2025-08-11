import { useAppForm } from "@repo/ds/hooks/use-form";
import { useTranslation } from "@repo/ds/lib/localization";
import { ErrorAlert } from "@repo/ds/ui/alert";
import { Button } from "@repo/ds/ui/button";
import { Input } from "@repo/ds/ui/input";

import { type VerifyEmailSchema, verifyEmailSchema } from "../schema";

export interface AuthVerifyProps {
	token?: string;
	onSubmit?(props: VerifyEmailSchema): void;
	onResend?(): void;
	errors?: { message: string }[] | { message: string } | null;
	isResending?: boolean;
	children?: React.ReactNode;
}

export function AuthVerify(props: AuthVerifyProps) {
	const form = useAppForm({
		defaultValues: {
			token: props.token || "",
		},
		validators: {
			onChange: verifyEmailSchema,
		},
		onSubmit: ({ value }) => props.onSubmit?.(value),
	});
	const { t } = useTranslation("auth");

	return (
		<>
			<ErrorAlert error={props.errors} />

			<form.Form
				form={form}
				className="flex flex-col w-full *:animate-top-in gap-4"
			>
				<form.AppField
					name="token"
					children={(field) => (
						<form.Fieldset label={t("verify.token")}>
							<Input
								value={field.state.value}
								onChange={field.handleChange}
								placeholder={t("verify.tokenPlaceholder")}
								className="text-center"
							/>
						</form.Fieldset>
					)}
				/>

				<div className="flex flex-col gap-2">
					{props.children}

					<Button
						type="button"
						onClick={() => props.onResend?.()}
						disabled={props.isResending}
						className="text-sm"
					>
						{props.isResending
							? t("verify.resending")
							: t("verify.resend")}
					</Button>
				</div>
			</form.Form>
		</>
	);
}
