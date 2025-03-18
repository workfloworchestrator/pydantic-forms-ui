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
    children: React.ReactNode;
}

export const FieldWrap = ({ pydanticFormField, children }: FieldWrapProps) => {
    const { errorDetails, rhf, config } = usePydanticFormContext();
    const RowRenderer = config?.rowRenderer ? config.rowRenderer : FormRow;
    const fieldState = rhf.getFieldState(pydanticFormField.id);
    const errorMsg =
        errorDetails?.mapped?.[pydanticFormField.id]?.msg ??
        fieldState.error?.message;
    const isInvalid = errorMsg ?? fieldState.invalid;

    return (
        <RowRenderer
            title={pydanticFormField.title}
            description={pydanticFormField.description}
            required={pydanticFormField.required}
            isInvalid={!!isInvalid}
            error={errorMsg as string}
        >
            <div>{children}</div>
        </RowRenderer>
    );
};
