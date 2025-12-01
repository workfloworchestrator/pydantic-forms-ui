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
    FormHasNext,
    PydanticFormApiProvider,
    PydanticFormApiResponse,
    PydanticFormApiResponseType,
    PydanticFormDefinitionResponse,
    PydanticFormSchemaRawJson,
    PydanticFormSuccessResponse,
    PydanticFormValidationResponse,
} from '@/types';

export function useApiProvider(
    formKey: string,
    formId: string,
    formInputData: FieldValues[],
    apiProvider: PydanticFormApiProvider,
    setApiResponse: React.Dispatch<
        React.SetStateAction<PydanticFormApiResponse | undefined>
    >,
) {
    return useSWR<PydanticFormApiResponse>(
        [formKey, formInputData, formId],
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
                        const formDefinitionResponse = {
                            type: PydanticFormApiResponseType.FORM_DEFINITION,
                            form: request.form,
                            meta: request.meta,
                        } as PydanticFormDefinitionResponse;
                        setApiResponse(formDefinitionResponse);
                        return;
                    }
                    if (request.validation_errors) {
                        const formValidationResponse = {
                            type: PydanticFormApiResponseType.VALIDATION_ERRORS,
                            validation_errors: request.validation_errors,
                        } as PydanticFormValidationResponse;
                        setApiResponse(formValidationResponse);
                        return;
                    }
                    if (
                        request.status &&
                        request.status >= 200 &&
                        request.status < 300
                    ) {
                        const formSuccessResponse = {
                            type: PydanticFormApiResponseType.SUCCESS,
                            data: request.data,
                        } as PydanticFormSuccessResponse;
                        setApiResponse(formSuccessResponse);
                        return;
                    }
                    throw new Error('Unknown API Response code');
                })
                .catch((error) => {
                    console.error('Error in useSWR api', error);
                    throw new Error(error);
                });
        },
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
