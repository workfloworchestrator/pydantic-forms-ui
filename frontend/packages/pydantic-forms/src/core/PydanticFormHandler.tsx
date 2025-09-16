import React, { useCallback, useRef, useState } from 'react';
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
    const [formStep, setStep] = useState<FieldValues>();
    const formStepsRef = useRef<FieldValues[]>([]);
    const {
        validationErrorsDetails,
        apiError,
        hasNext,
        isFullFilled,
        isLoading,
        pydanticFormSchema,
        initialValues,
    } = usePydanticForm(formKey, config, formStepsRef, formStep);

    const handleStepSubmit = useCallback((fieldValues: FieldValues) => {
        setStep(fieldValues);
    }, []);

    const handleCancel = useCallback(() => {
        console.log('handleCancel');
        if (onCancel) {
            onCancel();
        }
    }, [onCancel]);
    return (
        <ReactHookForm
            pydanticFormSchema={pydanticFormSchema}
            isLoading={isLoading}
            isFullFilled={isFullFilled}
            isSending={false}
            hasNext={hasNext}
            apiError={apiError}
            validationErrorsDetails={validationErrorsDetails}
            initialValues={initialValues}
            handleSubmit={handleStepSubmit}
            hasPrevious={false}
            handleCancel={handleCancel}
            title={title}
        />
    );
};

export default PydanticFormHandler;
