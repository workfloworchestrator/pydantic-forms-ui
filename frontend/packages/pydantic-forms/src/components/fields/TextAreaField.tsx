import React from 'react';

import type { PydanticFormControlledElementProps } from '@/types';

export const TextAreaField = ({
    value,
    onChange,
    onBlur,
    disabled,
}: PydanticFormControlledElementProps) => {
    return (
        <textarea
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            defaultValue={value}
            disabled={disabled}
        />
    );
};
