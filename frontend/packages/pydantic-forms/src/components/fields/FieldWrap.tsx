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

import { useGetConfig } from '../../core';
import { PydanticFormField } from '../../types';
import { FormRow } from './FormRow';

interface FieldWrapProps {
    pydanticFormField: PydanticFormField;
    isInvalid: boolean;
    children: React.ReactNode;
    errorMessage?: string;
}

export const FieldWrap = ({
    pydanticFormField,
    isInvalid,
    errorMessage,
    children,
}: FieldWrapProps) => {
    const config = useGetConfig();
    const RowRenderer = config.rowRenderer ?? FormRow;
    const isInvalidField = errorMessage ?? isInvalid;

    return (
        <RowRenderer
            title={pydanticFormField.title}
            description={pydanticFormField.description}
            required={pydanticFormField.required}
            isInvalid={!!isInvalidField}
            error={errorMessage}
            data-testid={pydanticFormField.id}
        >
            <div>{children}</div>
        </RowRenderer>
    );
};
