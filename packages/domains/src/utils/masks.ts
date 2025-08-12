import masker from "imask";

const cpfParser = masker.createMask({
	mask: "000.000.000-00",
	placeholderChar: "#",
});

export const masks = {
	cpf(value: string) {
		cpfParser.resolve(value);

		return cpfParser.value;
	},
};
