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
import type { FieldValues } from 'react-hook-form';

import useSWR from 'swr';

import {
    PydanticFormApiProvider,
    PydanticFormApiResponse,
    PydanticFormApiResponseType,
} from '@/types';

export function useApiProvider(
    formKey: string,
    formInputData: FieldValues[], // TODO: This doesn't seem right
    apiProvider: PydanticFormApiProvider,
) {
    return useSWR<PydanticFormApiResponse>(
        [formKey, formInputData],
        ([formKey, formInputData]) => {
            const requestBody = formInputData;

            return apiProvider({
                formKey,
                requestBody,
            })
                .then((request) => {
                    if (!request) {
                        throw new Error('No API Response');
                    }
                    if (request.form) {
                        return {
                            type: PydanticFormApiResponseType.FORM_DEFINITION,
                            form: request.form,
                            meta: request.meta,
                        } as PydanticFormApiResponse;
                    }
                    if (request.validation_errors) {
                        return {
                            type: PydanticFormApiResponseType.VALIDATION_ERRORS,
                            validation_errors: request.validation_errors,
                        } as PydanticFormApiResponse;
                    }
                    if (
                        request.status &&
                        request.status >= 200 &&
                        request.status < 300
                    ) {
                        return {
                            type: PydanticFormApiResponseType.SUCCESS,
                            data: request.data ?? request,
                        } as PydanticFormApiResponse;
                    }
                    throw new Error('Unknown API Response code');
                })
                .catch((error) => {
                    console.error('Error in useSWR api', error);
                    throw new Error(error);
                });
        },
        // swr config
        {
            fallback: {},
            revalidateIfStale: true,
            revalidateOnReconnect: false,
            revalidateOnFocus: false,
            keepPreviousData: false,
            shouldRetryOnError: false,
        },
    );
}
