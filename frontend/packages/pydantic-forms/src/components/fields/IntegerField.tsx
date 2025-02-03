import React from 'react';

import type { PydanticFormFieldElementProps } from '@/types';

export const IntegerField = ({
    value,
    onChange,
    onBlur,
    disabled,
}: PydanticFormFieldElementProps) => {
    return (
        <input
            onBlur={onBlur}
            onChange={(t) => {
                const value = parseInt(t.currentTarget.value);
                onChange(value);
            }}
            disabled={disabled}
            value={value}
            type="number"
            style={{
                width: '400px',
                height: '30px',
                padding: '4px',
                marginTop: '4px',
            }}
        />
    );
};
