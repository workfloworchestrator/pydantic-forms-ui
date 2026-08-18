/**
 * Pydantic Forms
 *
 * List component for multiple choice items
 */
import React, { useState } from 'react';

import {
    PydanticFormControlledElementProps,
    PydanticFormFieldOption,
} from '../../types';

export const MultiSelectField = ({
    value,
    onChange,
    onBlur,
    disabled,
    pydanticFormField,
}: PydanticFormControlledElementProps) => {
    const options = pydanticFormField?.arrayItem?.options || [];
    const [multiSelectItems, setMultiSelectItems] = useState(value || []);

    return (
        <div>
            <select
                data-testid={pydanticFormField.id}
                onBlur={onBlur}
                disabled={disabled}
                value={multiSelectItems}
                onChange={(e) => {
                    const selectedValues = Array.from(
                        e.currentTarget.selectedOptions,
                        (option) => option.value,
                    );
                    setMultiSelectItems(selectedValues);
                    onChange(selectedValues);
                }}
                multiple
            >
                {options?.map((option: PydanticFormFieldOption) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
};
