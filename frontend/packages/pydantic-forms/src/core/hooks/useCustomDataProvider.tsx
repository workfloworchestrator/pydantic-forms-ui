import useSWR from 'swr';
import { FetcherResponse } from 'swr/dist/_internal';

import { IDynamicFormApiErrorResponse, IDynamicFormsLabels } from '@/types';

const useCustomDataProvider = (
    cacheKey: number,
    promiseFn?: () => FetcherResponse<IDynamicFormsLabels>,
) => {
    return useSWR<IDynamicFormApiErrorResponse | object>(
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
