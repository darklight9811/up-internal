import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { LoaderIcon } from "lucide-react";
import type { ComponentProps } from "react";

import { Button } from "../components/button";

export const { fieldContext, formContext, useFormContext, useFieldContext } =
	createFormHookContexts();

export function Submit({
	children,
	...props
}: Omit<ComponentProps<typeof Button>, "type">) {
	const form = useFormContext();

	return (
		<form.Subscribe selector={(state) => state.isSubmitting}>
			{(isSubmitting) => (
				<Button
					{...props}
					type="submit"
					disabled={isSubmitting || props.disabled}
				>
					{isSubmitting && <LoaderIcon className="animate-spin" />}
					{children}
				</Button>
			)}
		</form.Subscribe>
	);
}

export const { useAppForm } = createFormHook({
	fieldComponents: {},
	formComponents: {
		Form({
			children,
			form,
			...props
		}: React.ComponentProps<"form"> & {
			form: {
				handleSubmit(): void;
				AppForm: React.ComponentType<{ children?: React.ReactNode }>;
			};
		}) {
			return (
				<form.AppForm>
					<form
						{...props}
						onSubmit={(e) => {
							e.preventDefault();
							e.stopPropagation();
							form.handleSubmit();
						}}
					>
						{children}
					</form>
				</form.AppForm>
			);
		},
		Submit,
		Fieldset(props: { children: React.ReactNode; label?: string }) {
			const field = useFieldContext();

			return (
				<fieldset>
					{props.label && (
						<label className="pb-2" htmlFor={field.name}>
							{props.label}
						</label>
					)}
					{props.children}
					<p
						className="mt-2 text-sm font-medium text-destructive h-5"
						role="alert"
					>
						{field.state.meta.errors
							.map((t) => t.message)
							.join(", ")}
					</p>
				</fieldset>
			);
		},
	},
	fieldContext,
	formContext,
});
