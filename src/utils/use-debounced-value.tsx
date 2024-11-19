import { useEffect, useRef, useState } from "react";

// Source code: https://github.com/mantinedev/mantine/blob/master/packages/@mantine/hooks/src/use-debounced-value/use-debounced-value.ts

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function useDebouncedValue<T = any>(
	value: T,
	wait: number,
	options = { leading: false },
) {
	const [_value, setValue] = useState(value);
	const mountedRef = useRef(false);
	const timeoutRef = useRef<number | null>(null);
	const cooldownRef = useRef(false);

	// biome-ignore lint/style/noNonNullAssertion: <explanation>
	const cancel = () => window.clearTimeout(timeoutRef.current!);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (mountedRef.current) {
			if (!cooldownRef.current && options.leading) {
				cooldownRef.current = true;
				setValue(value);
			} else {
				cancel();
				timeoutRef.current = window.setTimeout(() => {
					cooldownRef.current = false;
					setValue(value);
				}, wait);
			}
		}
	}, [value, options.leading, wait]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		mountedRef.current = true;
		return cancel;
	}, []);

	return [_value, cancel] as const;
}