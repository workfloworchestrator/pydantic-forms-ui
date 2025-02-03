/**
 * Pydantic Forms
 *
 * Text component
 */
import React from 'react';

import { PydanticFormFieldElementProps } from '@/types';

export const TextField = ({
    value,
    onChange,
    onBlur,
    disabled,
}: PydanticFormFieldElementProps) => (
    <input
        onBlur={onBlur}
        onChange={(t) => {
            onChange(t.currentTarget.value);
        }}
        disabled={disabled}
        value={value}
        type="text"
        style={{
            width: '400px',
            height: '30px',
            padding: '4px',
            marginTop: '4px',
        }}
    />
);
