/**
 * Pydantic Forms
 *
 * Text component
 */
import React from 'react';

import { PydanticFormControlledElementProps } from '../../types';

export const DropdownField = ({
    value,
    onChange,
    pydanticFormField,
}: PydanticFormControlledElementProps) => {
    return (
        <select
            data-testid={pydanticFormField.id}
            value={value ?? ''}
            onChange={(e) => {
                onChange(e.target.value);
            }}
            disabled={!!pydanticFormField.attributes.disabled}
        >
            {/* Without an empty option the browser shows the first option as selected while the
                form value is still empty. It's only selectable when the field accepts null. */}
            <option
                value=""
                disabled={!pydanticFormField.validations.isNullable}
            ></option>
            {pydanticFormField.options?.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );
};
