import useSWR from 'swr';

import { PydanticFormCustomDataProvider, PydanticFormLabels } from '@/types';

export const useCustomDataProvider = (
    customDataProviderCacheKey: number,
    customDataProvider?: PydanticFormCustomDataProvider,
) => {
    return useSWR<PydanticFormLabels>(
        // cache key
        [`pydanticFormsDataProvider-${customDataProviderCacheKey}`],

        // return val
        () => {
            if (!customDataProvider) {
                return {};
            }

            return customDataProvider();
        },

        {
            fallback: {},

            // we dont want to refresh the form structure automatically
            revalidateIfStale: false,
            revalidateOnReconnect: false,
            revalidateOnFocus: false,
            keepPreviousData: true,
            shouldRetryOnError: false,
        },
    );
};
