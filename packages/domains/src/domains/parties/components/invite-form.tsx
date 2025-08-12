import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { Submit, useAppForm } from "@repo/ds/hooks/use-form";
import { toast } from "@repo/ds/ui/sonner";

import { trpc } from "@repo/domains";
import { metadata } from "@repo/domains/app";
import { AuthRegister, useSession } from "@repo/domains/auth";

export const meta = metadata();

export function InviteForm({ id }: { id: string }) {
	const [shouldRegister, setShouldRegister] = useState(false);

	const user = useSession();
	const { data: party } = useQuery(trpc.parties.show.queryOptions(id));

	const { mutateAsync: request } = useMutation(
		trpc.parties.members.request.mutationOptions({
			onSuccess() {
				toast.success("Solicitação enviada com sucesso!", {
					description: "Espere um membro do partido aprovar sua solicitação",
				});
			},
		}),
	);
	const { mutateAsync: register, error } = useMutation(
		trpc.auth.register.mutationOptions({
			onSuccess(data) {
				if (data?.id) {
					return request(id);
				}

				toast.error("Houve um erro ao registrar-se");
			},
		}),
	);

	const form = useAppForm({
		onSubmit: () => {
			if (!user) return setShouldRegister(true);

			return request(id);
		},
	});

	if (!party) return null;

	return shouldRegister ? (
		<div className="max-w-md w-full">
			<AuthRegister onSubmit={register} errors={error}>
				<Submit>Registrar e solicitar entrada</Submit>
			</AuthRegister>
		</div>
	) : (
		<form.Form form={form}>
			<Submit className="max-w-md w-full">Solicitar entrada</Submit>
		</form.Form>
	);
}
