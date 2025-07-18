import React from 'react';

import _ from 'lodash';

import type { PydanticFormControlledElementProps } from '@/types';

export const IntegerField = ({
    value,
    onChange,
    onBlur,
    disabled,
    pydanticFormField,
}: PydanticFormControlledElementProps) => {
    return (
        <input
            data-testid={pydanticFormField.id}
            onBlur={onBlur}
            onChange={(t) => {
                const value = parseInt(t.currentTarget.value);
                onChange(value);
            }}
            disabled={disabled}
            // Value will be an object when it is added by an array field. We do this be able to add more than one empty field
            value={_.isObject(value) ? '' : value}
            type="number"
            style={{
                padding: '8px',
                margin: '8px 0',
            }}
        />
    );
};
