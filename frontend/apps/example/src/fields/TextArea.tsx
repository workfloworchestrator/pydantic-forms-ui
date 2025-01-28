/**
 * Pydantic Forms
 *
 * Text component
 */
import React from 'react';

import type {
    PydanticFormFieldElement,
    PydanticFormFieldElementProps,
} from 'pydantic-forms';

export const TextArea: PydanticFormFieldElement = ({
    value,
    onChange,
    onBlur,
    disabled,
    pydanticFormField,
}: PydanticFormFieldElementProps) => {
    console.log(pydanticFormField);
    return (
        <textarea
            defaultValue={value}
            onChange={(e) => onChange(e.target.value)}
            style={{
                width: '450px',
                height: '100px',
                border: 'thin solid pink',
            }}
        ></textarea>
    );
};
