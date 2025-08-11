import { useAppForm } from "@repo/ds/hooks/use-form";
import { useTranslation } from "@repo/ds/lib/localization";
import { Input } from "@repo/ds/ui/input";

import { type UserFormSchema, userFormSchema } from "../schema";

interface Props {
	onSubmit(data: UserFormSchema): Promise<unknown>;
	data?: Partial<UserFormSchema>;

	children?: React.ReactNode;
	className?: string;
}

export function UserForm(props: Props) {
	const { t } = useTranslation("auth");
	const form = useAppForm({
		defaultValues: props.data as UserFormSchema,
		validators: {
			onSubmit: userFormSchema,
		},
		onSubmit: ({ value }) => props.onSubmit(value),
	});

	return (
		<form.Form form={form} className={props.className}>
			<form.AppField
				name="name"
				children={(field) => (
					<form.Fieldset label={t("fields.name")}>
						<Input
							value={field.state.value}
							onChange={field.handleChange}
						/>
					</form.Fieldset>
				)}
			/>
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

			{props.children}
		</form.Form>
	);
}
