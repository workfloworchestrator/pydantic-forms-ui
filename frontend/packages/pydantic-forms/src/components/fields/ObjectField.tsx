import React from 'react';

// import { usePydanticFormContext } from '@/core';
import { PydanticFormElementProps } from '@/types';

// import { RenderFields } from '../render';

export const ObjectField = ({
    pydanticFormField,
}: PydanticFormElementProps) => {
    return (
        <div>
            <h1>{pydanticFormField.title}</h1>
        </div>
    );
};
