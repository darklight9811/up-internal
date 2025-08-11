import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
	const { theme = "system" } = useTheme();

	return (
		<Sonner
			theme={theme as ToasterProps["theme"]}
			className="toaster group"
			position="top-center"
			offset={52}
			mobileOffset={52}
			toastOptions={{
				className: "bg-g-1",
				classNames: {
					toast: "!shadow-depth",
				},
			}}
			style={
				{
					"--normal-bg": "var(--primary)",
					"--normal-text": "var(--background)",
					"--normal-border": "var(--border)",
				} as React.CSSProperties
			}
			{...props}
		/>
	);
};

export { toast } from "sonner";
export { Toaster };
