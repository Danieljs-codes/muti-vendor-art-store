export const convertToObject = <T>(
	value: string | Record<string, unknown>,
): T => {
	return typeof value === "string" ? JSON.parse(value) : value;
};

export const omit = <
	T extends Record<string, unknown>,
	K extends [...(keyof T)[]],
>(
	originalObject: T,
	keysToOmit: K,
): {
	[K2 in Exclude<keyof T, K[number]>]: T[K2];
} => {
	const clonedObject = { ...originalObject };

	for (const path of keysToOmit) {
		delete clonedObject[path];
	}

	return clonedObject;
};

export const koboToNaira = (amount: number) => {
	return amount / 100;
};

export const formatCurrency = ({
	amount,
	isKobo = true,
}: {
	amount: number;
	isKobo?: boolean;
}) => {
	const amountInNaira = isKobo ? koboToNaira(amount) : amount;
	return new Intl.NumberFormat("en-NG", {
		style: "currency",
		currency: "NGN",
	}).format(amountInNaira);
};

export const sleep = (ms: number) =>
	new Promise((resolve) => setTimeout(resolve, ms));

export const ARTWORK_CATEGORIES = [
	"PAINTING",
	"SCULPTURE",
	"PHOTOGRAPHY",
	"DIGITAL",
	"MIXED_MEDIA",
	"DRAWING",
	"PRINTMAKING",
	"TEXTILE",
	"CERAMIC",
	"OTHER",
] as const;

export type ArtworkCategory = (typeof ARTWORK_CATEGORIES)[number];