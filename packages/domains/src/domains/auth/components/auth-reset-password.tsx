import { useAppForm } from "@repo/ds/hooks/use-form";
import { useTranslation } from "@repo/ds/lib/localization";
import { ErrorAlert } from "@repo/ds/ui/alert";
import { Input } from "@repo/ds/ui/input";

import { type ResetPasswordSchema, resetPasswordSchema } from "../schema";

export interface AuthResetPasswordProps {
	token?: string;
	onSubmit?(props: ResetPasswordSchema): void;
	errors?: { message: string }[] | { message: string } | null;
	children?: React.ReactNode;
}

export function AuthResetPassword(props: AuthResetPasswordProps) {
	const form = useAppForm({
		defaultValues: {
			token: props.token || "",
			password: "",
		},
		validators: {
			onChange: resetPasswordSchema,
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
						<form.Fieldset label={t("resetPassword.token")}>
							<Input
								value={field.state.value}
								onChange={field.handleChange}
								className="text-center"
								disabled={!!props.token}
							/>
						</form.Fieldset>
					)}
				/>

				<form.AppField
					name="password"
					children={(field) => (
						<form.Fieldset label={t("resetPassword.newPassword")}>
							<Input
								type="password"
								value={field.state.value}
								onChange={field.handleChange}
							/>
						</form.Fieldset>
					)}
				/>

				{props.children}
			</form.Form>
		</>
	);
}
