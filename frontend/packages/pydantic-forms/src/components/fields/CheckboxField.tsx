import React from 'react';

import { PydanticFormControlledElementProps } from '@/types';

export const CheckboxField = ({
    onChange,
    onBlur,
    value,
    name,
    disabled,
    pydanticFormField,
}: PydanticFormControlledElementProps) => {
    return (
        <input
            data-testid={pydanticFormField.id}
            type="checkbox"
            checked={value}
            onChange={() => onChange(!value)}
            onBlur={onBlur}
            name={name}
            disabled={disabled}
        />
    );
};
