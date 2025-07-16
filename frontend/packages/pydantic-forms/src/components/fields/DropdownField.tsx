/**
 * Pydantic Forms
 *
 * Text component
 */
import React from 'react';

import { PydanticFormControlledElementProps } from '@/types';

export const DropdownField = ({
    value,
    onChange,
    pydanticFormField,
}: PydanticFormControlledElementProps) => {
    return (
        <select
            data-testid={pydanticFormField.id}
            value={value}
            onChange={(e) => {
                onChange(e.target.value);
            }}
            disabled={!!pydanticFormField.attributes.disabled}
        >
            {pydanticFormField.options?.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );
};
