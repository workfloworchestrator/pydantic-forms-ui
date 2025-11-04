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
    PydanticFormSuccessResponse,
    PydanticFormValidationErrorDetails,
} from '@/types';
import { PydanticFormApiResponseType, PydanticFormFieldType } from '@/types';

import { useApiProvider, useLabelProvider, usePydanticFormParser } from './';

export interface UsePydanticFormReturn {
    validationErrorsDetails: PydanticFormValidationErrorDetails | null;
    apiError: string | undefined;
    hasNext: boolean;
    isFullFilled: boolean;
    isLoading: boolean;
    isSending: boolean;
    pydanticFormSchema?: PydanticFormSchema;
    defaultValues: FieldValues;
    handleRemoveValidationError: (location: string[]) => void;
}

const removeValidationErrorByLoc = (
    validationErrors: PydanticFormValidationErrorDetails | null,
    locToRemove: (string | number)[]
): PydanticFormValidationErrorDetails | null => {

    if (!validationErrors) return null;

    const newSource = validationErrors.source.filter(
        (err) => JSON.stringify(err.loc) !== JSON.stringify(locToRemove)
    );

    const topKey = locToRemove[0]?.toString();
    const newMapped = { ...validationErrors.mapped };

    if (topKey && newMapped[topKey]) {
        delete newMapped[topKey];
    }

    return {
        ...validationErrors,
        source: newSource,
        mapped: newMapped,
    };
}

export function usePydanticForm(
    formKey: string,
    config: PydanticFormConfig,
    formStepsRef: React.MutableRefObject<FieldValues[]>,
    cacheKey: string,
    handleSuccess?: (
        fieldValues: FieldValues[],
        response: PydanticFormSuccessResponse,
    ) => void,
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
        useState<PydanticFormValidationErrorDetails | null>(null);

    const { labelProvider, apiProvider, componentMatcherExtender } = config;

    // fetch the labels of the form, can also contain default values
    const { data: formLabels, isLoading: isLoadingFormLabels } =
        useLabelProvider(labelProvider, formKey, cacheKey);

    const formSteps = formStepsRef.current;

    const formInputData = useMemo(() => {
        return formStep ? [...formSteps, formStep] : [...formSteps];
    }, [formStep, formSteps]);

    // fetch API response with form definition
    const {
        data: apiResponse,
        isLoading: isLoadingSchema,
        error: apiError,
    } = useApiProvider(formKey, formInputData, apiProvider, cacheKey);

    // extract the JSON schema to a more usable custom schema
    const { pydanticFormSchema, isLoading: isParsingSchema } =
        usePydanticFormParser(rawSchema, formLabels?.labels);

    const defaultValues = useMemo(() => {
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
        } else if (apiResponse.type === PydanticFormApiResponseType.SUCCESS) {
            if (handleSuccess) {
                handleSuccess(formInputData, apiResponse);
            }
            setValidationErrorsDetails(null);
            setIsFullFilled(true);
            return;
        }

        if (
            apiResponse.type === PydanticFormApiResponseType.FORM_DEFINITION &&
            rawSchema !== apiResponse.form
        ) {
            setRawSchema(apiResponse.form);
            setValidationErrorsDetails(null);
            if (formStep) {
                formStepsRef.current.push(formStep);
            }
            if (apiResponse.meta) {
                setHasNext(!!apiResponse.meta.hasNext);
            }
        }
        setIsSending(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [apiResponse]);

    const handleRemoveValidationError = (location: string[]) => {
        setValidationErrorsDetails((prev) =>
            removeValidationErrorByLoc(prev, location)
        );
    }

    return {
        validationErrorsDetails,
        apiError,
        hasNext,
        isFullFilled,
        isLoading,
        pydanticFormSchema,
        defaultValues,
        isSending,
        handleRemoveValidationError
    };
}
