export const i18n = {
	interpolation: {
		escapeValue: false,
	},
	lowerCaseLng: true,
	// This is the list of languages your application supports
	supportedLngs: ["en-us", "pt-br"],
	// This is the language you want to use in case
	// if the user language is not in the supportedLngs
	fallbackLng: "pt-br",
	// The default namespace of i18next is "translation", but you can customize it here
	defaultNS: "general",
	ns: ["general"],
};

export default i18n;
