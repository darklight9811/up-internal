import {
	Body,
	Column,
	Head,
	Html,
	Img,
	Link,
	Preview,
	pixelBasedPreset,
	Row,
	Section,
	Tailwind,
	Text,
} from "@react-email/components";

import { env } from "@repo/domains/app";

import { useMessages } from "./localization";

export function Structure(props: {
	children?: React.ReactNode;
	title?: string;
	locale?: "pt-br" | "en-us";
	actions?: { text: string; url: string; style?: React.CSSProperties }[];
}) {
	const t = useMessages(props.locale || "en-us");

	return (
		<Tailwind
			config={{
				presets: [pixelBasedPreset],
				theme: {
					extend: {},
					fontFamily: { sans: "Jua, Helvetica, sans-serif" },
				},
			}}
		>
			<Html>
				<Head>
					{props.title && <title>{props.title}</title>}
					<style>{`
					:root {
						color-scheme: light dark;
					}

					@media (prefers-color-scheme: dark) {
						body {
							background-image: url(${env.app_url}/textures/pattern-dark.png);
						}
					}
					@media (prefers-color-scheme: light) {
						body {
							background-image: url(${env.app_url}/textures/pattern.png);
						}
					}
					`}</style>
				</Head>

				{props.title && <Preview>{props.title}</Preview>}

				<Body className="font-sans !text-[#010101] p-4">
					<Section>
						<Section className="p-6 flex justify-center">
							<Link href={`${env.app_url}`}>
								<Img
									src={`${env.app_url}/logo.png`}
									alt="logo"
									className="max-w-[250px]"
								/>
							</Link>
						</Section>

						{props.title && (
							<Text className="text-3xl font-bold text-center">
								{props.title}
							</Text>
						)}

						{props.children}

						{props.actions && (
							<Section className="my-12">
								{props.actions.map((action, index) => (
									<Row key={index}>
										<Section className="flex justify-center w-full">
											<Link
												href={action.url}
												className="p-4 rounded-xl text-white mt-8 bg-[#3F2420]"
												style={{
													boxShadow:
														"inset 0 2px rgba(255, 255, 255, 0.2), inset 0 -2px rgba(0, 0, 0, 0.2)",
													border: "2px solid #121212",
													...action.style,
												}}
											>
												{action.text}
											</Link>
										</Section>
									</Row>
								))}
							</Section>
						)}

						<Section
							className="p-4 rounded-xl text-white mt-8 text-center bg-[#3F2420]"
							style={{
								boxShadow:
									"inset 0 2px rgba(255, 255, 255, 0.2), inset 0 -2px rgba(0, 0, 0, 0.2)",
								border: "2px solid #121212",
							}}
						>
							<Row className="text-foreground">
								© {new Date().getFullYear()} -{" "}
								{t("structure.copyright")}
							</Row>

							<Row>
								<Column className="w-1/2">
									<Link
										className="text-foreground-active underline"
										href={`${env.app_url}/privacy-policy`}
									>
										{t("structure.privacy")}
									</Link>
								</Column>

								<Column className="w-1/2">
									<Link
										className="text-foreground-active underline"
										href={`${env.app_url}/terms-of-service`}
									>
										{t("structure.terms")}
									</Link>
								</Column>
							</Row>
						</Section>
					</Section>
				</Body>
			</Html>
		</Tailwind>
	);
}
