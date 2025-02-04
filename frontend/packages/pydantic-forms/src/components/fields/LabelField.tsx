import React from 'react';

import type { PydanticFormElementProp } from '@/types';

export const LabelField = ({ pydanticFormField }: PydanticFormElementProp) => {
    return (
        <div>
            <label>
                <h3>{pydanticFormField?.default}</h3>
            </label>
        </div>
    );
};
