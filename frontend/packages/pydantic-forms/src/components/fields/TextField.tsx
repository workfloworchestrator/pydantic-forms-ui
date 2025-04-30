/**
 * Pydantic Forms
 *
 * Text component
 */
import React from 'react';

import _ from 'lodash';

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
        // Value will be an object when it is added by an array field. We do this be able to add more than one empty field
        value={_.isObject(value) ? '' : value}
        type="text"
        style={{
            padding: '8px',
            margin: '8px 0',
        }}
    />
);
