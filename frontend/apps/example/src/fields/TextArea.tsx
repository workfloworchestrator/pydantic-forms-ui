import React from 'react';

import type {
    PydanticFormFieldElement,
    PydanticFormFieldElementProps,
} from 'pydantic-forms';

/**
 * Pydantic Forms
 *
 * Text component
 */
export const TextArea: PydanticFormFieldElement = ({
    value,
    onChange,
}: PydanticFormFieldElementProps) => {
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
