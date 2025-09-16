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
    pydanticFormField,
}: PydanticFormControlledElementProps) => (
    <input
        data-testid={pydanticFormField.id}
        onBlur={onBlur}
        onChange={(t) => {
            onChange(t.currentTarget.value);
        }}
        disabled={disabled}
        value={value}
        type="text"
        style={{
            padding: '8px',
            margin: '8px 0',
        }}
    />
);
