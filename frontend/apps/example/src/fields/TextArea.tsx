/**
 * Pydantic Forms
 *
 * Text component
 */
import React from 'react';

import type {
    PydanticFormControlledElement,
    PydanticFormControlledElementProps,
} from 'pydantic-forms';

export const TextArea: PydanticFormControlledElement = ({
    value,
    onChange,
}: PydanticFormControlledElementProps) => {
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
