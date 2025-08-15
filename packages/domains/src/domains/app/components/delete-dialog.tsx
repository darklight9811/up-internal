import { Submit, useAppForm } from "@repo/ds/hooks/use-form";
import { Button } from "@repo/ds/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@repo/ds/ui/dialog";

export interface DeleteDialogProps {
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	onDelete?: () => void;
}

export function DeleteDialog(props: DeleteDialogProps) {
	const form = useAppForm({
		onSubmit: () => props.onDelete?.(),
	});

	return (
		<Dialog open={props.open} onOpenChange={props.onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Apagar item</DialogTitle>
					<DialogDescription>Tem certeza de que deseja apagar este item?</DialogDescription>
				</DialogHeader>

				<DialogFooter>
					<form.Form form={form}>
						<Submit>Apagar</Submit>
					</form.Form>
					<DialogTrigger asChild>
						<Button>Voltar</Button>
					</DialogTrigger>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
