import { useDeferredValue } from "react";
import { useDeepCompareMemo } from "use-deep-compare";
import { useSpinDelay } from "spin-delay";

import {
  type DefaultError,
  type QueryKey,
  type UseSuspenseQueryOptions,
  useSuspenseQuery,
} from "@tanstack/react-query";

// This hook allows useSuspenseQuery to only show the fallback on initial load the default useSuspenseQuery behavior would show the fallback if the queryKey changes but we only wanna show it on initial load
// https://www.teemutaskula.com/blog/exploring-query-suspense (Blog post that explains how this works)
export function useSuspenseQueryDeferred<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(options: UseSuspenseQueryOptions<TQueryFnData, TError, TData, TQueryKey>) {
  const queryKey = useDeepCompareMemo(
    () => options.queryKey,
    [options.queryKey]
  );

  const deferredQueryKey = useDeferredValue(queryKey);

  const query = useSuspenseQuery({
    ...options,
    queryKey: deferredQueryKey,
  });

  const isSuspending = useSpinDelay(queryKey !== deferredQueryKey);

  return { ...query, isSuspending };
}