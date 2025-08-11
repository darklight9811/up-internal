import { FrownIcon, LaughIcon, MehIcon, SmileIcon } from "lucide-react";

import { cn } from "../lib/utils";

export function Score(props: {
	value?: number | null;
	onChange?: (value: number) => void;
}) {
	return (
		<div className="flex justify-evenly gap-2 w-full">
			<button
				className={cn(
					"hover:cursor-pointer hover:text-red-500 transition-colors",
					props.value === 1 && "text-red-500",
				)}
				type="button"
				onClick={() => props.onChange?.(1)}
			>
				<FrownIcon size={64} />
			</button>
			<button
				className={cn(
					"hover:cursor-pointer hover:text-yellow-500 transition-colors",
					props.value === 2 && "text-yellow-500",
				)}
				type="button"
				onClick={() => props.onChange?.(2)}
			>
				<MehIcon size={64} />
			</button>
			<button
				className={cn(
					"hover:cursor-pointer hover:text-green-500 transition-colors",
					props.value === 3 && "text-green-500",
				)}
				type="button"
				onClick={() => props.onChange?.(3)}
			>
				<SmileIcon size={64} />
			</button>
			<button
				className={cn(
					"hover:cursor-pointer hover:text-primary transition-colors",
					props.value === 4 && "text-primary",
				)}
				type="button"
				onClick={() => props.onChange?.(4)}
			>
				<LaughIcon size={64} />
			</button>
		</div>
	);
}
