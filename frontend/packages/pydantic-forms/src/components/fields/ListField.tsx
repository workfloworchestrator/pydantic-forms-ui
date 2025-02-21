/**
 * Pydantic Forms
 *
 * List component for multiple choice items
 */
import React, { useState } from 'react';

import {
    PydanticFormControlledElementProps,
    PydanticFormFieldOption,
} from '@/types';

export const ListField = ({
    value,
    onChange,
    onBlur,
    disabled,
    pydanticFormField,
}: PydanticFormControlledElementProps & {
    options?: Array<{ value: string; label: string }>;
}) => {
    const [listItems, setListItems] = useState(value || []);

    return (
        <div>
            <select
                onBlur={onBlur}
                disabled={disabled}
                value={listItems}
                onChange={(e) => {
                    const selectedValues = Array.from(
                        e.currentTarget.selectedOptions,
                        (option) => option.value,
                    );
                    setListItems(selectedValues);
                    onChange(selectedValues);
                }}
                multiple
            >
                {pydanticFormField.options.map(
                    (option: PydanticFormFieldOption) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ),
                )}
            </select>
        </div>
    );
};
