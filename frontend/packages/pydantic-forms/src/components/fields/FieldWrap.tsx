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
    const RowRenderer = FormRow;
    console.log('FieldWrap render', pydanticFormField.id);

    return (
        <RowRenderer
            title={pydanticFormField.title}
            description={pydanticFormField.description}
            required={pydanticFormField.required}
            isInvalid={!!isInvalid}
            error={frontendValidationMessage}
            data-testid={pydanticFormField.id}
        >
            <div>{children}</div>
        </RowRenderer>
    );
};
