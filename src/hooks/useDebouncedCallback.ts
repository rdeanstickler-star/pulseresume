import { useEffect, useMemo, useRef } from 'react';

/**
 * Returns a stable debounced version of `callback`. The debounced function
 * delays invocation until `wait` ms have elapsed since the last call.
 *
 * The returned function is stable across renders — safe to pass to deps
 * arrays or memoized children. Internally we keep the latest `callback`
 * via a ref so closures stay current without invalidating the identity.
 *
 * Default wait = 120 ms (matches the project-wide input debounce target).
 *
 * On unmount, any pending timer is cleared so we don't fire callbacks
 * against unmounted React state.
 */
export function useDebouncedCallback<TArgs extends unknown[]>(
  callback: (...args: TArgs) => void,
  wait = 120,
): (...args: TArgs) => void {
  const callbackRef = useRef(callback);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep ref pointed at the latest callback without changing identity.
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Cleanup on unmount.
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return useMemo(() => {
    return (...args: TArgs) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        callbackRef.current(...args);
      }, wait);
    };
  }, [wait]);
}
