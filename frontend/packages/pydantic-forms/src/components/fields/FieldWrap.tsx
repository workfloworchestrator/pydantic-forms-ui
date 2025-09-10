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

import { usePydanticFormContext } from '@/core';
import { PydanticFormField } from '@/types';

import { FormRow } from './FormRow';

interface FieldWrapProps {
    pydanticFormField: PydanticFormField;
    children: React.ReactNode;
}

export const FieldWrap = ({ pydanticFormField, children }: FieldWrapProps) => {
    const { validationErrorDetails, reactHookForm, config } =
        usePydanticFormContext();
    const RowRenderer = config?.rowRenderer ? config.rowRenderer : FormRow;
    const fieldState = reactHookForm.getFieldState(pydanticFormField.id);
    const errorMsg =
        validationErrorDetails?.mapped?.[pydanticFormField.id]?.msg ??
        fieldState.error?.message;
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
