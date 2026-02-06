import React from 'react';

import { PydanticFormElementProps } from 'pydantic-forms';

export const LabelField = ({ pydanticFormField }: PydanticFormElementProps) => {
    const hasDefault = pydanticFormField?.default !== undefined;
    const label = hasDefault
        ? pydanticFormField.default
        : pydanticFormField?.title;

    return (
        <div data-testid={pydanticFormField.id}>
            {hasDefault ? (
                <h2
                    className="
                        text-[28px] mt-2 -mb-6
                    "
                >
                    {label}
                </h2>
            ) : (
                <label>{label}</label>
            )}
        </div>
    );
};
