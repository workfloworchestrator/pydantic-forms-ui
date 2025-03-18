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
import type { ControllerFieldState } from 'react-hook-form';

import { usePydanticFormContext } from '@/core';
import { PydanticFormField } from '@/types';

import { FormRow } from './FormRow';

interface FieldWrapProps {
    pydanticFormField: PydanticFormField;
    fieldState: ControllerFieldState;
    children: React.ReactNode;
}

export const FieldWrap = ({
    pydanticFormField,
    fieldState,
    children,
}: FieldWrapProps) => {
    const { errorDetails } = usePydanticFormContext();

    const errorMsg =
        errorDetails?.mapped?.[pydanticFormField.id]?.msg ??
        fieldState.error?.message;
    const isInvalid = errorMsg ?? fieldState.invalid;

    return (
        <FormRow
            title={pydanticFormField.title}
            description={pydanticFormField.description}
            required={pydanticFormField.required}
            isInvalid={!!isInvalid}
            error={errorMsg as string}
        >
            <div>{children}</div>
        </FormRow>
    );
};
