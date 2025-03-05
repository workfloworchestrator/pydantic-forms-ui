import React from 'react';

import { usePydanticFormContext } from '@/core';
import { componentMatcher } from '@/core';
import { PydanticFormElementProps } from '@/types';

import { RenderFields } from '../render';

export const ObjectField = ({
    pydanticFormField,
}: PydanticFormElementProps) => {
    const { config } = usePydanticFormContext();

    const components = componentMatcher(
        pydanticFormField.properties || {},
        config?.componentMatcher,
    );

    return (
        <div>
            <h1>{pydanticFormField.title}</h1>
            <RenderFields components={components} />
        </div>
    );
};
