import React from 'react';

import { usePydanticFormContext } from '@/core';
import { getPydanticFormComponents } from '@/core/helper';
import { PydanticFormElementProps } from '@/types';

import { RenderFields } from '../render';

export const ObjectField = ({
    pydanticFormField,
}: PydanticFormElementProps) => {
    const { config } = usePydanticFormContext();
    const components = getPydanticFormComponents(
        pydanticFormField.properties || {},
        config?.componentMatcher,
    );

    return (
        <div
            style={{
                border: 'thin dotted grey',
                padding: '1rem',
                marginTop: '16px',
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
            }}
        >
            <h1>{pydanticFormField.title}</h1>
            <RenderFields pydanticFormComponents={components} />
        </div>
    );
};
