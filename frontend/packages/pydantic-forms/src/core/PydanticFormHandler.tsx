import React, { useRef, useState } from 'react';
import type { FieldValues } from 'react-hook-form';

import { ReactHookForm } from './ReactHookForm';
import { useGetConfig, usePydanticForm } from './hooks';

export interface PydanticFormHandlerProps {
    formKey: string;
    onCancel?: () => void;
    onSuccess?: (fieldValues: FieldValues, response: object) => void;
    title?: string;
}

export const PydanticFormHandler = ({
    formKey,
    onCancel,
    onSuccess,
    title,
}: PydanticFormHandlerProps) => {
    const config = useGetConfig();
    const formSteps = useRef<FieldValues[]>([]);
    const [formStep, setStep] = useState<FieldValues>();

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
        formSteps.current,
        formKey,
        config,
        updateFormStepsRef,
        formStep,
    );

    return (
        <ReactHookForm
            pydanticFormSchema={pydanticFormSchema}
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
