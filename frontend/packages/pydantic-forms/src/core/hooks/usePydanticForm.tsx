/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Dynamic Forms
 *
 * SWR Hook to fetch the JSON Schema from the backend.
 * In this hook we also POST the form data when its available.
 *
 * Anytime the formKey, formInputData, metaData or swrConfig changes,
 * we call the API again.
 *
 * In this hook we make an API call, ignore 510 and 400 responses
 * and type the response to the expected format
 *
 * Disabled revalidate / refresh system of SWR, this would cause submissions
 */
import useSWR, { SWRConfiguration } from 'swr';

import type {
    PydanticFormApiErrorResponse,
    PydanticFormMetaData,
    PydanticFormProvider,
} from '@/types';

const ignoreApiErrors = async (
    req: Promise<unknown>,
    ignoreCodes: number[],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> => {
    // eslint-disable-next-line no-console
    console.log('TODO: What to use these for?', ignoreCodes);
    try {
        return await req;
    } catch (error) {
        throw error;
    }
};

export function usePydanticForm(
    formKey: string,
    formInputData: PydanticFormMetaData, // TODO: This doesn't seem right
    formProvider: PydanticFormProvider,
    metaData?: PydanticFormMetaData,
    cacheKey?: number,
    swrConfig?: SWRConfiguration,
) {
    return useSWR<PydanticFormApiErrorResponse>(
        // cache key
        [formKey, formInputData, metaData, swrConfig, cacheKey],

        // return val
        async ([formKey, formInputData, metaData]) => {
            // TODO: Readd sending metadata along with request
            // eslint-disable-next-line no-console
            console.log('calls fetcher in USESwr hook!');
            const requestBody = formInputData;

            const formProviderRequest = formProvider({
                formKey,
                requestBody,
            });

            const req = (await ignoreApiErrors(
                formProviderRequest,
                [510, 400],
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            )) as any;

            if (
                Object.keys(req).length === 0 ||
                (!req.validation_errors && !req.form)
            ) {
                return {
                    success: true,
                };
            }

            return req;
        },

        // swr config
        {
            fallback: {},

            // we dont want to refresh the form structure automatically
            revalidateIfStale: false,
            revalidateOnReconnect: false,
            revalidateOnFocus: false,
            keepPreviousData: true,
            shouldRetryOnError: false,

            ...swrConfig,
        },
    );
}
