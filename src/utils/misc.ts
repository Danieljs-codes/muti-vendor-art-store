export const convertToObject = <T>(
	value: string | Record<string, unknown>,
): T => {
	return typeof value === "string" ? JSON.parse(value) : value;
};
