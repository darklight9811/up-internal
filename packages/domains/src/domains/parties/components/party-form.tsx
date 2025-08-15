import { useAppForm } from "@repo/ds/hooks/use-form";
import { Input } from "@repo/ds/ui/input";
import { Textarea } from "@repo/ds/ui/textarea";

import { type PartyFormSchema, partyFormSchema } from "../schema";

export interface CoreFormProps {
	data?: Partial<PartyFormSchema> | null;
	onSubmit?: (data: PartyFormSchema) => void;
	children?: React.ReactNode;
}

export function PartyForm({ children, onSubmit, data }: CoreFormProps) {
	const form = useAppForm({
		defaultValues: {
			slug: data?.slug || "",
			name: data?.name || "",
			description: data?.description || ("" as string | null),
			location: [0, 0] as [number, number] | null,
		},
		validators: {
			onSubmit: partyFormSchema,
		},
		onSubmit: ({ value }) => onSubmit?.(value),
	});

	return (
		<form.Form form={form}>
			<form.AppField
				name="slug"
				children={(field) => (
					<form.Fieldset label="Slug">
						<Input name="slug" value={field.state.value} onChange={field.handleChange} />
					</form.Fieldset>
				)}
			/>

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
