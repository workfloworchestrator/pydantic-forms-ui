/**
 * Pydantic Forms
 *
 * Text component
 */
import React from 'react';

import _ from 'lodash';

import { PydanticFormControlledElementProps } from '@/types';
import { getFormFieldIdWithPath } from '@/utils';

export const TextField = ({
    value,
    onChange,
    onBlur,
    disabled,
    pydanticFormField,
}: PydanticFormControlledElementProps) => {
    // If the field is part of an array the value is passed in as an object with the field name as key
    // this is imposed by react-hook-form. We try to detect this and extract the actual value
    const fieldName = getFormFieldIdWithPath(pydanticFormField.id);
    const fieldValue =
        _.isObject(value) && _.has(value, fieldName)
            ? _.get(value, fieldName)
            : value;

    return (
        <input
            data-testid={pydanticFormField.id}
            onBlur={onBlur}
            onChange={(t) => {
                onChange(t.currentTarget.value);
            }}
            disabled={disabled}
            value={fieldValue}
            type="text"
            style={{
                padding: '8px',
                margin: '8px 0',
            }}
        />
    );
};
