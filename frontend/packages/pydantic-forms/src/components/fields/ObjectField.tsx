import React from 'react';

import { usePydanticFormContext } from '@/core';
import { componentsMatcher } from '@/core';
import { PydanticFormElementProps } from '@/types';

import { RenderFields } from '../render';

export const ObjectField = ({
    pydanticFormField,
}: PydanticFormElementProps) => {
    const { config } = usePydanticFormContext();

    const components = componentsMatcher(
        pydanticFormField.properties || {},
        config?.componentMatcher,
    );

    return (
        <div
            style={{
                border: 'thin dotted grey',
                padding: '1rem',
                marginTop: '16px',
            }}
        >
            <h1>{pydanticFormField.title}</h1>
            <RenderFields components={components} />
        </div>
    );
};
