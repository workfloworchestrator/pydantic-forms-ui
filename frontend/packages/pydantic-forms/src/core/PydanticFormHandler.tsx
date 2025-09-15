import React from 'react';
import type { FieldValues } from 'react-hook-form';

import type { PydanticFormConfig } from '@/types';

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
    console.log(config, formKey, onCancel, onSuccess, title);
    return <>TODO: REACT HOOK FORM COMPONENT</>;
};

export default PydanticFormHandler;
