import type { PydanticFormApiProvider } from 'pydantic-forms';

enum Status {
    Ok = 200,
    Created = 201,
    ValidationError = 400,
    FormDefinition = 510,
}

const ERROR_STATUSES = [Status.ValidationError, Status.FormDefinition];
const SUCCESS_STATUSES = [Status.Ok, Status.Created];
const HANDLED_STATUSES = [...ERROR_STATUSES, ...SUCCESS_STATUSES];

/**
 * Creates a Pydantic Form API provider for the given endpoint.
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

            if (HANDLED_STATUSES.includes(fetchResult.status)) {
                const data = await fetchResult.json();

                return new Promise<Record<string, unknown>>(
                    (resolve, reject) => {
                        if (ERROR_STATUSES.includes(fetchResult.status)) {
                            resolve({ ...data, status: fetchResult.status });
                            return;
                        }
                        if (SUCCESS_STATUSES.includes(fetchResult.status)) {
                            resolve({ status: fetchResult.status, data });
                            return;
                        }
                        reject('No valid status in response');
                    },
                );
            }

            throw new Error(`Unexpected status: ${fetchResult.statusText}`);
        } catch (error) {
            throw new Error(`Fetch error: ${String(error)}`);
        }
    };
};
