/**
 * Pydantic Forms
 *
 * MultiCheckbox component for handling multiple boolean selections
 */
import React from 'react';

import {
    PydanticFormControlledElementProps,
    PydanticFormFieldOption,
} from '@/types';

export const MultiCheckboxField = ({
    value,
    onChange,
    pydanticFormField,
}: PydanticFormControlledElementProps) => {
    const { options, id } = pydanticFormField;

    const handleCheckboxChange = (optionId: string, optionValue: string) => {
        const currentValue = value as string[];
        const newValue = currentValue.includes(optionValue)
            ? currentValue.filter((item) => item !== optionValue)
            : [...currentValue, optionValue];

        onChange(newValue);
    };

    return (
        <div>
            {options?.map((option: PydanticFormFieldOption) => {
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
                            checked={(value as string[]).includes(option.value)}
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
