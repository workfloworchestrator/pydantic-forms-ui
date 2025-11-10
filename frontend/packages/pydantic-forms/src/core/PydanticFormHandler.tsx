import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { FieldValues } from 'react-hook-form';

import _ from 'lodash';

import { PydanticFormValidationErrorContext } from '@/PydanticForm';
import { useGetConfig, usePydanticForm } from '@/core/hooks';
import { PydanticFormHandlerProps, PydanticFormSuccessResponse } from '@/types';
import { getHashForArray } from '@/utils';

import { ReactHookForm } from './ReactHookForm';

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
    const [currentFormKey, setCurrentFormKey] = useState<string>(formKey);
    const [cacheKey, setCacheKey] = useState<string>(_.uniqueId(formKey));
    const formInputHistoryRef = useRef<Map<string, FieldValues>>(
        new Map<string, object>(),
    );

    useEffect(() => {
        if (formKey && formKey !== currentFormKey) {
            formStepsRef.current = [];
            formInputHistoryRef.current = new Map<string, object>();
            setCurrentFormKey(formKey);
            setStep(undefined);
            setInitialValues(undefined);
        }
    }, [formKey, currentFormKey]);

    const storeHistory = useCallback(async (stepData: FieldValues) => {
        const hashOfSteps = await getHashForArray(formStepsRef.current);
        formInputHistoryRef.current.set(hashOfSteps, stepData);
    }, []);

    const restoreHistory = useCallback(async (steps: FieldValues[]) => {
        const hashOfSteps = await getHashForArray(steps);
        if (formInputHistoryRef.current.has(hashOfSteps)) {
            setInitialValues(formInputHistoryRef.current.get(hashOfSteps));
        } else {
            setInitialValues(undefined);
        }
    }, []);

    const handleSuccess = (
        fieldValues: FieldValues[],
        response: PydanticFormSuccessResponse,
    ) => {
        if (onSuccess) {
            onSuccess(fieldValues, response);
        }
        setCacheKey(_.uniqueId(currentFormKey));
    };

    const {
        validationErrorsDetails,
        apiError,
        hasNext,
        isFullFilled,
        isLoading,
        pydanticFormSchema,
        defaultValues,
        handleRemoveValidationError,
    } = usePydanticForm(
        formKey,
        config,
        formStepsRef,
        cacheKey,
        handleSuccess,
        formStep,
    );

    const handleStepSubmit = useCallback(
        (fieldValues: FieldValues) => {
            storeHistory(fieldValues);
            setStep(fieldValues);
            restoreHistory([...formStepsRef.current, fieldValues]);
        },
        [restoreHistory, storeHistory],
    );

    const onPrevious = useCallback(async () => {
        const previousSteps = formStepsRef.current.slice(0, -1);
        formStepsRef.current = previousSteps;
        restoreHistory(previousSteps);
        setStep(undefined);
    }, [restoreHistory]);

    const handleCancel = useCallback(() => {
        setCacheKey(_.uniqueId(currentFormKey));
        if (onCancel) {
            onCancel();
        }
    }, [currentFormKey, onCancel]);

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
                handleRemoveValidationError={handleRemoveValidationError}
            />
        </PydanticFormValidationErrorContext.Provider>
    );
};

export default PydanticFormHandler;
