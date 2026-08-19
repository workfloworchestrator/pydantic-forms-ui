/**
 * Pydantic Forms
 *
 * MultiCheckbox component for handling multiple boolean selections
 */
import React from 'react';

import { PydanticFormControlledElementProps } from '../../types';

export const MultiCheckboxField = ({
    value,
    onChange,
    pydanticFormField,
}: PydanticFormControlledElementProps) => {
    const { arrayItem, id } = pydanticFormField;
    const options = arrayItem?.options;

    const currentValue = (value as string[]) ?? [];

    const handleCheckboxChange = (optionId: string, optionValue: string) => {
        const newValue = currentValue.includes(optionValue)
            ? currentValue.filter((item) => item !== optionValue)
            : [...currentValue, optionValue];

        onChange(newValue);
    };

    return (
        <div>
            {options?.map((option) => {
                // Extract the unique ID for this option
                const optionId = `${id}-${option.value}`;

                return (
                    <label key={optionId}>
                        <input
                            data-testid={id}
                            type="checkbox"
                            id={optionId}
                            name={optionId}
                            value={option.value}
                            checked={currentValue.includes(option.value)}
                            onChange={() =>
                                handleCheckboxChange(optionId, option.value)
                            }
                        />
                        <span>{option.label || option.value}</span>
                    </label>
                );
            })}
        </div>
    );
};
