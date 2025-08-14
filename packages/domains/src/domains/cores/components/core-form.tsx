import { useAppForm } from "@repo/ds/hooks/use-form";
import { Input } from "@repo/ds/ui/input";
import { Textarea } from "@repo/ds/ui/textarea";

import { type CoreFormSchema, coreFormSchema } from "../schema";

export interface CoreFormProps {
	data?: Partial<CoreFormSchema>;
	onSubmit?: (data: CoreFormSchema) => void;
	children?: React.ReactNode;
}

export function CoreForm({ children, onSubmit, data }: CoreFormProps) {
	const form = useAppForm({
		defaultValues: {
			name: data?.name || "",
			partyId: data?.partyId || "",
			description: data?.description || ("" as string | null),
			location: [0, 0] as [number, number] | null,
		},
		validators: {
			onSubmit: coreFormSchema,
		},
		onSubmit: ({ value }) => onSubmit?.(value),
	});

	return (
		<form.Form form={form}>
			<form.AppField
				name="name"
				children={(field) => (
					<form.Fieldset label="Nome">
						<Input name="name" value={field.state.value} onChange={field.handleChange} />
					</form.Fieldset>
				)}
			/>

			<form.AppField
				name="description"
				children={(field) => (
					<form.Fieldset label="Descrição">
						<Textarea
							id="description"
							name="description"
							value={field.state.value}
							onChange={field.handleChange}
						/>
					</form.Fieldset>
				)}
			/>
			{children}
		</form.Form>
	);
}
