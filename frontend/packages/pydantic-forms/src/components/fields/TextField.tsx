/**
 * Pydantic Forms
 *
 * Text component
 */
import React from 'react';

import { PydanticFormControlledElementProps } from '@/types';

export const TextField = ({
    value,
    onChange,
    onBlur,
    disabled,
}: PydanticFormControlledElementProps) => (
    <input
        onBlur={onBlur}
        onChange={(t) => {
            onChange(t.currentTarget.value);
        }}
        disabled={disabled}
        value={value}
        type="text"
    />
);
