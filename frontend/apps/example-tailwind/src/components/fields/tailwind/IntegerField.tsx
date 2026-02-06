import React from 'react';

import _ from 'lodash';
import {
    PydanticFormControlledElementProps,
    getFormFieldIdWithPath,
} from 'pydantic-forms';

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
                const value = t.currentTarget.value;
                // ? parseInt(t.currentTarget.value, 2)
                // : ''

                onChange(value);
            }}
            disabled={disabled}
            value={fieldValue}
            type="number"
            className={
                'w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15'
            }
        />
    );
};
