import type { PydanticFormApiProvider } from 'pydantic-forms';

/**
 * Creates a Pydantic Form API provider for the given endpoint.
 * Handles standard response statuses (200, 201, 400, 510).
 *
 * @param endpoint - The API endpoint path (e.g., '/form-simple')
 * @param baseUrl - Optional base URL (defaults to localhost:8000)
 */
export const createApiProvider = (
    endpoint: string,
    baseUrl: string = 'http://localhost:8000',
): PydanticFormApiProvider => {
    return async ({ requestBody }) => {
        const url = `${baseUrl}${endpoint}`;

        try {
            const fetchResult = await fetch(url, {
                method: 'POST',
                body: JSON.stringify(requestBody),
                headers: { 'Content-Type': 'application/json' },
            });

            if (
                fetchResult.status === 400 ||
                fetchResult.status === 510 ||
                fetchResult.status === 200 ||
                fetchResult.status === 201
            ) {
                const data = await fetchResult.json();

                return new Promise<Record<string, unknown>>(
                    (resolve, reject) => {
                        if (
                            fetchResult.status === 510 ||
                            fetchResult.status === 400
                        ) {
                            resolve({ ...data, status: fetchResult.status });
                            return;
                        }
                        if (
                            fetchResult.status === 200 ||
                            fetchResult.status === 201
                        ) {
                            resolve({ status: fetchResult.status, data });
                            return;
                        }
                        reject('No valid status in response');
                    },
                );
            }

            throw new Error(
                `Status not 400, 510, 200 or 201: ${fetchResult.statusText}`,
            );
        } catch (error) {
            throw new Error(`Fetch error: ${String(error)}`);
        }
    };
};
