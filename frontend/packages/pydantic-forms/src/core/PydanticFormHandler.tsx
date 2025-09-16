import React, { useCallback, useRef, useState } from 'react';
import type { FieldValues } from 'react-hook-form';

import { PydanticFormValidationErrorContext } from '@/PydanticForm';
import { useGetConfig, usePydanticForm } from '@/core/hooks';
import { PydanticFormSuccessResponse } from '@/types';
import { getHashForArray } from '@/utils';

import { ReactHookForm } from './ReactHookForm';

export interface PydanticFormHandlerProps {
    formKey: string;
    onCancel?: () => void;
    onSuccess?: (
        fieldValues: FieldValues[],
        response: PydanticFormSuccessResponse,
    ) => void;
    title?: string;
}

export const PydanticFormHandler = ({
    formKey,
    onCancel,
    onSuccess,
    title,
}: PydanticFormHandlerProps) => {
    const config = useGetConfig();
    const [formStep, setStep] = useState<FieldValues>();
    const formStepsRef = useRef<FieldValues[]>([]);
    const [initialValues, setInitialValues] = useState<FieldValues>();
    const formInputHistoryRef = useRef<Map<string, FieldValues>>(
        new Map<string, object>(),
    );

    const storeHistory = useCallback(async (stepData: FieldValues) => {
        const hashOfSteps = await getHashForArray(formStepsRef.current);
        formInputHistoryRef.current.set(hashOfSteps, stepData);
    }, []);

    const {
        validationErrorsDetails,
        apiError,
        hasNext,
        isFullFilled,
        isLoading,
        pydanticFormSchema,
        defaultValues,
    } = usePydanticForm(formKey, config, formStepsRef, onSuccess, formStep);

    const handleStepSubmit = useCallback(
        (fieldValues: FieldValues) => {
            storeHistory(fieldValues);
            setStep(fieldValues);
        },
        [storeHistory],
    );

    const onPrevious = useCallback(async () => {
        const previousSteps = formStepsRef.current.slice(0, -1);
        formStepsRef.current = previousSteps;
        const hashOfPreviousSteps = await getHashForArray(previousSteps);
        if (formInputHistoryRef.current.has(hashOfPreviousSteps)) {
            setInitialValues(
                formInputHistoryRef.current.get(hashOfPreviousSteps),
            );
        } else {
            setInitialValues(undefined);
        }
        setStep(undefined);
    }, []);

    const handleCancel = useCallback(() => {
        if (onCancel) {
            onCancel();
        }
    }, [onCancel]);

    return (
        <PydanticFormValidationErrorContext.Provider
            value={validationErrorsDetails}
        >
            <ReactHookForm
                apiError={apiError}
                defaultValues={defaultValues}
                handleCancel={handleCancel}
                handleSubmit={handleStepSubmit}
                hasNext={hasNext}
                hasPrevious={formStepsRef.current.length > 0}
                initialValues={initialValues}
                isFullFilled={isFullFilled}
                isLoading={isLoading}
                onPrevious={onPrevious}
                pydanticFormSchema={pydanticFormSchema}
                title={title}
            />
        </PydanticFormValidationErrorContext.Provider>
    );
};

export default PydanticFormHandler;
