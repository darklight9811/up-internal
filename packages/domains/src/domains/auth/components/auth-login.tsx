import { useAppForm } from "@repo/ds/hooks/use-form";
import { useTranslation } from "@repo/ds/lib/localization";
import { ErrorAlert } from "@repo/ds/ui/alert";
import { Input } from "@repo/ds/ui/input";

import { type LoginSchema, loginSchema } from "../schema";

export interface AuthLoginProps {
	onSubmit?(props: LoginSchema): void;
	errors?: { message: string }[] | { message: string } | null;
	children?: React.ReactNode;
}

export function AuthLogin(props: AuthLoginProps) {
	const form = useAppForm({
		defaultValues: {
			email: "",
			password: "",
		},
		validators: {
			onChange: loginSchema,
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
							/>
						</form.Fieldset>
					)}
				/>
				<form.AppField
					name="password"
					children={(field) => (
						<form.Fieldset label={t("fields.password")}>
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
