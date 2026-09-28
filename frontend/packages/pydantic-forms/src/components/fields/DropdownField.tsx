/**
 * Pydantic Forms
 *
 * Text component
 */
import React from 'react';

import { PydanticFormControlledElementProps } from '../../types';
import { getLayoutFieldWidthStyle } from '../../utils';

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
            style={getLayoutFieldWidthStyle(pydanticFormField)}
        >
            {pydanticFormField.options?.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );
};
