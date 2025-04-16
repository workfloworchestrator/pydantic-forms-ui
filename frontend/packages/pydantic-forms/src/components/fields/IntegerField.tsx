import React from 'react';

import { isObject } from 'lodash';

import type { PydanticFormControlledElementProps } from '@/types';

export const IntegerField = ({
    value,
    onChange,
    onBlur,
    disabled,
}: PydanticFormControlledElementProps) => {
    return (
        <input
            onBlur={onBlur}
            onChange={(t) => {
                const value = parseInt(t.currentTarget.value);
                onChange(value);
            }}
            disabled={disabled}
            value={!isObject(value) ? value : undefined} // Value can be an object when it is created from an ArrayField
            type="number"
            style={{
                padding: '8px',
                margin: '8px 0',
            }}
        />
    );
};
