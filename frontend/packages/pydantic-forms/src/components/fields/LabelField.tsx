import React from 'react';

import type { PydanticFormElementProps } from '@/types';

export const LabelField = ({ pydanticFormField }: PydanticFormElementProps) => {
    return (
        <div>
            <label>
                <h3>{pydanticFormField?.default}</h3>
            </label>
        </div>
    );
};
