import React from 'react';

import { PydanticFormControlledElementProps } from '../../types';

export const BooleanField = ({
    onChange,
    value,
    pydanticFormField,
}: PydanticFormControlledElementProps) => {
    const id = pydanticFormField.id;
    const isNullable = pydanticFormField.validations.isNullable;

    return (
        <>
            <input
                data-testid={`${id}-true`}
                type="radio"
                id={`${id}-true`}
                name={id}
                value={'true'}
                checked={value === true}
                onChange={() => {
                    onChange(true);
                }}
            />
            <input
                data-testid={`${id}-false`}
                type="radio"
                id={`${id}-false`}
                name={id}
                value={'false'}
                checked={value === false}
                onChange={() => {
                    onChange(false);
                }}
            />
            {isNullable && (
                <input
                    data-testid={`${id}-unset`}
                    type="radio"
                    id={`${id}-null`}
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
