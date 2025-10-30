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
import useSWR from 'swr';

import {
    PydanticFormLabelProvider,
    PydanticFormLabelProviderResponse,
} from '@/types';

export function useLabelProvider(
    labelProvider?: PydanticFormLabelProvider,
    formKey?: string,
    cacheKey?: string,
) {
    return useSWR<PydanticFormLabelProviderResponse | undefined>(
        // cache key
        [labelProvider, formKey, cacheKey],

        // return val
        async () => {
            if (labelProvider) {
                return labelProvider({
                    formKey: formKey || '',
                    id: cacheKey,
                });
            }
        },
        {
            fallback: {},
            revalidateIfStale: false,
            revalidateOnReconnect: false,
            revalidateOnFocus: false,
            keepPreviousData: true,
            shouldRetryOnError: false,
        },
    );
}
