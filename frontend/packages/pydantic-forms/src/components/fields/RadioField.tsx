/**
 * Pydantic Forms
 *
 * Text component
 */
import React from 'react';

import { PydanticFormControlledElementProps } from '@/types';

export const RadioField = ({
    value,
    onChange,
    pydanticFormField,
}: PydanticFormControlledElementProps) => {
    const { options, id } = pydanticFormField;

    return (
        <div>
            {options?.map((option, key) => (
                <div key={key}>
                    <input
                        data-testid={`${id}-${option.value}`}
                        type="radio"
                        id={option.value}
                        name={id}
                        value={option.value}
                        checked={value === option.value}
                        onChange={(e) => onChange(e.target.value)}
                    />
                     <label htmlFor={option.value}>{option.label}</label>
                </div>
            ))}
        </div>
    );
};
