import React from 'react';

import { PydanticFormControlledElementProps } from '@/types';

export const CheckboxField = ({
    onChange,
    onBlur,
    value,
    name,
    disabled,
}: PydanticFormControlledElementProps) => {
    return (
        <input
            type="checkbox"
            checked={value}
            onChange={() => onChange(!value)}
            onBlur={onBlur}
            name={name}
            disabled={disabled}
        />
    );
};
