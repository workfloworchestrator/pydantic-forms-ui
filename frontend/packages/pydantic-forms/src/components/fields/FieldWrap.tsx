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

import { useGetConfig } from '@/core';
import { useGetValidationErrors } from '@/core';
import { PydanticFormField } from '@/types';

import { FormRow } from './FormRow';

interface FieldWrapProps {
    pydanticFormField: PydanticFormField;
    isInvalid: boolean;
    children: React.ReactNode;
    frontendValidationMessage?: string;
}

export const FieldWrap = ({
    pydanticFormField,
    isInvalid,
    frontendValidationMessage,
    children,
}: FieldWrapProps) => {
    const config = useGetConfig();
    const validationErrors = useGetValidationErrors();
    const RowRenderer = config.rowRenderer ?? FormRow;

    const errorMsg =
        validationErrors?.mapped?.[pydanticFormField.id]?.msg ??
        frontendValidationMessage;
    const isInvalidField = errorMsg ?? isInvalid;

    return (
        <RowRenderer
            title={pydanticFormField.title}
            description={pydanticFormField.description}
            required={pydanticFormField.required}
            isInvalid={!!isInvalidField}
            error={errorMsg}
            data-testid={pydanticFormField.id}
        >
            <div>{children}</div>
        </RowRenderer>
    );
};
