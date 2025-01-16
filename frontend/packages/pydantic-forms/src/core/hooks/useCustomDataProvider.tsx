import useSWR from 'swr';

import { PydanticFormCustomDataProvider, PydanticFormLabels } from '@/types';

const useCustomDataProvider = (
    cacheKey: number,
    customDataProvider?: PydanticFormCustomDataProvider,
) => {
    return useSWR<PydanticFormLabels>(
        // cache key
        [`pydanticFormsDataProvider-${cacheKey}`],

        // return val
        () => {
            if (!customDataProvider) {
                return {};
            }

            return customDataProvider();
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
        },
    );
};

export default useCustomDataProvider;
