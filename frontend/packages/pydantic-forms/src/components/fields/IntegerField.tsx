import React from 'react';

import _ from 'lodash';

import type { PydanticFormControlledElementProps } from '@/types';
import { getFormFieldIdWithPath } from '@/utils';

export const IntegerField = ({
    value,
    onChange,
    onBlur,
    disabled,
    pydanticFormField,
}: PydanticFormControlledElementProps) => {
    const fieldName = getFormFieldIdWithPath(pydanticFormField.id);
    const fieldValue = (() => {
        // If the field is part of an array the value is passed in as an object with the field name as key
        // this is imposed by react-hook-form. We try to detect this and extract the actual value
        if (_.isObject(value) && _.has(value, fieldName)) {
            return _.get(value, fieldName);
        } else if (value === null) {
            // When the value is set to null (-eg the field isNullable and the value is removed)
            // we display '' to avoid letting the field become 'uncontrolled' (eg. getting the console error ".. a component is
            // going from controlled to uncontrolled ...").
            return '';
        }
        return value;
    })();

    return (
        <input
            data-testid={pydanticFormField.id}
            onBlur={onBlur}
            onChange={(t) => {
                const value = t.currentTarget.value
                    ? parseInt(t.currentTarget.value)
                    : '';

                onChange(value);
            }}
            disabled={disabled}
            value={fieldValue}
            type="number"
            style={{
                padding: '8px',
                margin: '8px 0',
            }}
        />
    );
};
