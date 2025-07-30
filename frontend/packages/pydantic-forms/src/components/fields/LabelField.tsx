import React from 'react';

import type { PydanticFormElementProps } from '@/types';

export const LabelField = ({ pydanticFormField }: PydanticFormElementProps) => {
    return (
        <div data-testid={pydanticFormField.id}>
            <label>{pydanticFormField?.title}</label>
        </div>
    );
};
