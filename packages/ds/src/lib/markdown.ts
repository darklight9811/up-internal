import { createElement } from "react";

export function parseMarkdown(text: string) {
	return text
		.split("\n")
		.filter(Boolean)
		.map((line) => {
			if (line.startsWith("###"))
				return createElement(
					"h3",
					{ className: "font-bold my-4", key: line },
					line.replace(/^###\s*/, ""),
				);
			else if (line.startsWith("##"))
				return createElement(
					"h2",
					{ className: "text-xl font-bold my-4", key: line },
					line.replace(/^##\s*/, ""),
				);
			else if (line.startsWith("#"))
				return createElement(
					"h1",
					{ className: "text-3xl font-bold my-4", key: line },
					line.replace(/^#\s*/, ""),
				);

			return createElement("p", { key: line }, line);
		});
}
