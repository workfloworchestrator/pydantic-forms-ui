import useSWR from 'swr';
import { FetcherResponse } from 'swr/dist/_internal';

import { PydanticFormApiErrorResponse, PydanticFormLabels } from '@/types';

const useCustomDataProvider = (
    cacheKey: number,
    promiseFn?: () => FetcherResponse<PydanticFormLabels>,
) => {
    return useSWR<PydanticFormApiErrorResponse | object>(
        // cache key
        [`dynamicFormsDataProvider-${cacheKey}`],

        // return val
        () => {
            if (!promiseFn) {
                return {};
            }

            return promiseFn();
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
