/**
 * Pydantic Forms
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
    PydanticFormApiProvider,
    PydanticFormApiResponse,
    PydanticFormMetaData,
} from '@/types';

const ignoreApiErrors = async (req: Promise<unknown>): Promise<unknown> => {
    try {
        return await req;
    } catch (error) {
        throw error;
    }
};

export function useApiProvider(
    formKey: string,
    formInputData: PydanticFormMetaData, // TODO: This doesn't seem right
    apiProvider: PydanticFormApiProvider,
    metaData?: PydanticFormMetaData,
    cacheKey?: number,
    swrConfig?: SWRConfiguration,
) {
    return useSWR<PydanticFormApiResponse>(
        // cache key
        [formKey, formInputData, metaData, swrConfig, cacheKey],

        // return val
        async ([formKey, formInputData]) => {
            // TODO: Readd sending metadata along with request
            const requestBody = formInputData;

            const apiProviderRequest = apiProvider({
                formKey,
                requestBody,
            });
            const req = (await ignoreApiErrors(
                apiProviderRequest,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            )) as any;

            if (
                Object.keys(req).length === 0 ||
                (!req.validation_errors && !req.form)
            ) {
                return {
                    response: req,
                    success: true,
                };
            }

            return req;
        },

        // swr config
        {
            fallback: {},

            // We revalidate to make sure the form updates when we use it a second time
            revalidateIfStale: true,
            revalidateOnReconnect: false,
            revalidateOnFocus: false,
            // We want to make sure the correct data is showing so we don't want to prefill with stale data
            // we dont use the previous data because of that
            keepPreviousData: false,
            shouldRetryOnError: false,

            ...swrConfig,
        },
    );
}
