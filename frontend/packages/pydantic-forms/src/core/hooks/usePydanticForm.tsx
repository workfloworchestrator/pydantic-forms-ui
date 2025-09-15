import React, { useEffect, useMemo, useState } from 'react';
import type { FieldValues } from 'react-hook-form';

import {
    getFormValuesFromFieldOrLabels,
    getValidationErrorDetailsFromResponse,
} from '@/core/helper';
import type {
    PydanticFormConfig,
    PydanticFormSchema,
    PydanticFormSchemaRawJson,
    PydanticFormValidationErrorDetails,
} from '@/types';
import { PydanticFormApiResponseType, PydanticFormFieldType } from '@/types';

import { useApiProvider, useLabelProvider, usePydanticFormParser } from './';

export interface UsePydanticFormReturn {
    validationErrorsDetails: PydanticFormValidationErrorDetails | undefined;
    apiError: string | undefined;
    hasNext: boolean;
    isFullFilled: boolean;
    isSending: boolean;
    isLoading: boolean;
    pydanticFormSchema?: PydanticFormSchema;
    initialValues: FieldValues;
}

export function usePydanticForm(
    formSteps: FieldValues[],
    formKey: string,
    config: PydanticFormConfig,
    updateFormStepsRef: (steps: FieldValues[]) => void,
    formStep?: FieldValues,
): UsePydanticFormReturn {
    const emptyRawSchema: PydanticFormSchemaRawJson = useMemo(
        () => ({
            type: PydanticFormFieldType.OBJECT,
            properties: {},
        }),
        [],
    );
    const [isFullFilled, setIsFullFilled] = useState<boolean>(false);
    const [isSending, setIsSending] = useState<boolean>(false);
    const [rawSchema, setRawSchema] =
        useState<PydanticFormSchemaRawJson>(emptyRawSchema);
    const [hasNext, setHasNext] = useState<boolean>(false);
    const [validationErrorsDetails, setValidationErrorsDetails] =
        useState<PydanticFormValidationErrorDetails>();

    const { labelProvider, apiProvider, componentMatcherExtender } = config;

    // fetch the labels of the form, can also contain default values
    const { data: formLabels, isLoading: isLoadingFormLabels } =
        useLabelProvider(labelProvider, formKey);
    useLabelProvider(labelProvider, formKey);

    const formInputData = formStep ? [...formSteps, formStep] : [];

    // fetch API response with form definition
    const {
        data: apiResponse,
        isLoading: isLoadingSchema,
        error: apiError,
    } = useApiProvider(formKey, formInputData, apiProvider);

    // extract the JSON schema to a more usable custom schema
    const { pydanticFormSchema, isLoading: isParsingSchema } =
        usePydanticFormParser(rawSchema, formLabels?.labels);

    const initialValues = useMemo(() => {
        return getFormValuesFromFieldOrLabels(
            pydanticFormSchema?.properties,
            {
                ...formLabels?.data,
            },
            componentMatcherExtender,
        );
    }, [
        componentMatcherExtender,
        formLabels?.data,
        pydanticFormSchema?.properties,
    ]);

    const isLoading = isLoadingFormLabels || isLoadingSchema || isParsingSchema;

    // useEffect to handle API responses
    useEffect(() => {
        if (!apiResponse) {
            return;
        }

        if (
            apiResponse.type === PydanticFormApiResponseType.VALIDATION_ERRORS
        ) {
            setValidationErrorsDetails(
                getValidationErrorDetailsFromResponse(apiResponse),
            );
            return;
        }

        // TODO: Update formSteps

        if (apiResponse.type === PydanticFormApiResponseType.SUCCESS) {
            setIsFullFilled(true);
            return;
        }

        if (
            apiResponse.type === PydanticFormApiResponseType.FORM_DEFINITION &&
            rawSchema !== apiResponse.form
        ) {
            setRawSchema(apiResponse.form);
            if (apiResponse.meta) {
                setHasNext(!!apiResponse.meta.hasNext);
            }
        }

        setIsSending(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [apiResponse]);

    return {
        validationErrorsDetails,
        apiError,
        hasNext,
        isFullFilled,
        isSending,
        isLoading,
        pydanticFormSchema,
        initialValues,
    };
}
