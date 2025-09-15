import React, { useMemo, useRef, useState } from 'react';
import type { FieldValues } from 'react-hook-form';

import type { PydanticFormConfig } from '@/types';

import { ReactHookForm } from './ReactHookForm';
import { usePydanticForm } from './hooks';

export interface PydanticFormHandlerProps {
    config: PydanticFormConfig;
    formKey: string;
    onCancel?: () => void;
    onSuccess?: (fieldValues: FieldValues, response: object) => void;
    title?: string;
}

export const PydanticFormHandler = ({
    config,
    formKey,
    onCancel,
    onSuccess,
    title,
}: PydanticFormHandlerProps) => {
    const formSteps = useRef<FieldValues[]>([]);
    const [formStep, setStep] = useState<FieldValues>({});

    const updateFormStepsRef = (steps: FieldValues[]) => {
        formSteps.current = steps;
    };

    const {
        validationErrorsDetails,
        apiError,
        hasNext,
        isFullFilled,
        isSending,
        isLoading,
        pydanticFormSchema,
        initialValues,
    } = usePydanticForm(
        formStep,
        formSteps.current,
        formKey,
        updateFormStepsRef,
    );

    console.log('PydanticFormHandler render');
    return (
        <ReactHookForm
            pydanticFormSchema={pydanticFormSchema}
            config={config}
            isLoading={isLoading}
            isFullFilled={isFullFilled}
            isSending={isSending}
            hasNext={hasNext}
            apiError={apiError}
            validationErrorsDetails={validationErrorsDetails}
            initialValues={initialValues}
            handleSubmit={() => {
                console.log('handleSubmit');
            }}
            handleCancel={() => {
                console.log('handleCancel');
            }}
        />
    );
};

export default PydanticFormHandler;
