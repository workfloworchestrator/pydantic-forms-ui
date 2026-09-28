import React from 'react';

import type { PydanticFormControlledElementProps } from '../../types';
import { getLayoutFieldWidthStyle } from '../../utils';

export const TextAreaField = ({
    value,
    onChange,
    onBlur,
    disabled,
    pydanticFormField,
}: PydanticFormControlledElementProps) => {
    return (
        <textarea
            data-testid={pydanticFormField.id}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            defaultValue={value}
            disabled={disabled}
            style={getLayoutFieldWidthStyle(pydanticFormField)}
        />
    );
};
