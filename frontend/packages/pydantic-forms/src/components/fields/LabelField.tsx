import React from 'react';

import type { PydanticFormElementProps } from '@/types';

export const LabelField = ({ pydanticFormField }: PydanticFormElementProps) => {
    return (
        <div>
            <label>{pydanticFormField?.default}</label>
        </div>
    );
};
