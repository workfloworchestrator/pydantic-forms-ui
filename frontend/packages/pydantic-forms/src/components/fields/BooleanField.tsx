import React from 'react';

import { PydanticFormControlledElementProps } from '../../types';

export const BooleanField = ({
    onChange,
    // onBlur,
    value,
    // name,
    pydanticFormField,
}: PydanticFormControlledElementProps) => {
    const id = pydanticFormField.id;
    console.log(value, pydanticFormField);
    const isNullable = pydanticFormField.validations.isNullable;

    return (
        <>
            <input
                data-testid={`${id}-true`}
                type="radio"
                id={'true'}
                name={id}
                value={'true'}
                checked={value === true}
                onChange={(e) => {
                    onChange(e.target.value);
                }}
            />
            <input
                data-testid={`${id}-false`}
                type="radio"
                id={'false'}
                name={id}
                value={'false'}
                checked={value === false}
                onChange={(e) => {
                    onChange(e.target.value);
                }}
            />
            {isNullable && (
                <input
                    data-testid={`${id}-unset`}
                    type="radio"
                    id={'null'}
                    name={id}
                    value={'null'}
                    checked={!value && value !== false}
                    onChange={() => {
                        onChange(null);
                    }}
                />
            )}
        </>
    );
};
