import { usePathname, useRouter, useSearchParams } from 'next/navigation';

/**
 * Hook to manage a single query parameter in the URL.
 * Provides a useState-like interface for query parameters.
 *
 * @param key - The query parameter key
 * @param defaultValue - The default value if the parameter is not present
 * @returns A tuple of [value, setValue] similar to useState
 *
 * @example
 * const [mode, setMode] = useQueryParam('mode', 'static');
 * // URL: /page?mode=async
 * console.log(mode); // 'async'
 * setMode('static'); // Updates URL to /page?mode=static
 */
export function useQueryParam(
    key: string,
    defaultValue: string,
): readonly [string, (value: string) => void] {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const value = searchParams.get(key) || defaultValue;

    const setValue = (newValue: string) => {
        // Preserve other query parameters
        const params = new URLSearchParams(searchParams.toString());
        params.set(key, newValue);
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    return [value, setValue] as const;
}
