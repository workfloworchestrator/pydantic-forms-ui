/**
 * Pydantic Forms
 *
 * Main input wrap component
 *
 * This handles the validated / error state of the element as well as the label
 * This component should wrap every field, at the field component level
 *
 */
import React from 'react';
import { useFormContext } from 'react-hook-form';

import { PydanticFormField } from '@/types';

import { FormRow } from './FormRow';

interface FieldWrapProps {
    pydanticFormField: PydanticFormField;
    children: React.ReactNode;
}

export const FieldWrap = ({ pydanticFormField, children }: FieldWrapProps) => {
    const { getFieldState } = useFormContext();
    const RowRenderer = FormRow;
    const fieldState = getFieldState(pydanticFormField.id);
    const errorMsg = fieldState.error?.message;
    const isInvalid = errorMsg ?? fieldState.invalid;

    return (
        <RowRenderer
            title={pydanticFormField.title}
            description={pydanticFormField.description}
            required={pydanticFormField.required}
            isInvalid={!!isInvalid}
            error={errorMsg as string}
            data-testid={pydanticFormField.id}
        >
            <div>{children}</div>
        </RowRenderer>
    );
};
