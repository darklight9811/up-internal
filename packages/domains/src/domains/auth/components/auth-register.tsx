import { useAppForm } from "@repo/ds/hooks/use-form";
import { useTranslation } from "@repo/ds/lib/localization";
import { ErrorAlert } from "@repo/ds/ui/alert";
import { Input } from "@repo/ds/ui/input";

import { masks } from "../../../utils/masks";
import { type RegisterSchema, registerSchema } from "../schema";

export interface AuthRegisterProps {
	onSubmit?(props: RegisterSchema): void;
	errors?: { message: string }[] | { message: string } | null;
	children?: React.ReactNode;
}

export function AuthRegister(props: AuthRegisterProps) {
	const form = useAppForm({
		defaultValues: {
			name: "",
			email: "",
			password: "",
			socialNumber: "",
		},
		validators: {
			onSubmit: registerSchema,
		},
		onSubmit: ({ value }) => props.onSubmit?.(value),
	});
	const { t } = useTranslation("auth");

	return (
		<>
			<ErrorAlert error={props.errors} />

			<form.Form form={form} className="flex flex-col w-full *:animate-top-in">
				<form.AppField
					name="name"
					children={(field) => (
						<form.Fieldset label={t("fields.name")}>
							<Input value={field.state.value} onChange={field.handleChange} />
						</form.Fieldset>
					)}
				/>
				<form.AppField
					name="socialNumber"
					children={(field) => (
						<form.Fieldset label={t("fields.socialNumber")}>
							<Input
								type="socialNumber"
								value={field.state.value}
								onChange={(v) => field.handleChange(masks.cpf(v))}
							/>
						</form.Fieldset>
					)}
				/>
				<form.AppField
					name="email"
					children={(field) => (
						<form.Fieldset label={t("fields.email")}>
							<Input type="email" value={field.state.value} onChange={field.handleChange} />
						</form.Fieldset>
					)}
				/>
				<form.AppField
					name="password"
					children={(field) => (
						<form.Fieldset label={t("fields.password")}>
							<Input type="password" value={field.state.value} onChange={field.handleChange} />
						</form.Fieldset>
					)}
				/>

				{props.children}
			</form.Form>
		</>
	);
}
