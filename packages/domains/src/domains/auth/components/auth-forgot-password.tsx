import { useAppForm } from "@repo/ds/hooks/use-form";
import { useTranslation } from "@repo/ds/lib/localization";
import { ErrorAlert } from "@repo/ds/ui/alert";
import { Input } from "@repo/ds/ui/input";

import { type ForgotPasswordSchema, forgotPasswordSchema } from "../schema";

export interface AuthForgotPasswordProps {
	onSubmit?(props: ForgotPasswordSchema): void;
	errors?: { message: string }[] | { message: string } | null;
	children?: React.ReactNode;
}

export function AuthForgotPassword(props: AuthForgotPasswordProps) {
	const form = useAppForm({
		defaultValues: {
			email: "",
		},
		validators: {
			onChange: forgotPasswordSchema,
		},
		onSubmit: ({ value }) => props.onSubmit?.(value),
	});
	const { t } = useTranslation("auth");

	return (
		<>
			<ErrorAlert error={props.errors} />

			<form.Form
				form={form}
				className="flex flex-col w-full *:animate-top-in"
			>
				<form.AppField
					name="email"
					children={(field) => (
						<form.Fieldset label={t("fields.email")}>
							<Input
								type="email"
								value={field.state.value}
								onChange={field.handleChange}
								placeholder={t("fields.email-placeholder")}
							/>
						</form.Fieldset>
					)}
				/>

				{props.children}
			</form.Form>
		</>
	);
}
