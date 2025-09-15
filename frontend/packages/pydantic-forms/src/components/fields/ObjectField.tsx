import React from 'react';

import { getPydanticFormComponents } from '@/core/helper';
import { PydanticFormElementProps } from '@/types';
import { disableField } from '@/utils';

import { RenderFields } from '../render';

export const ObjectField = ({
    pydanticFormField,
}: PydanticFormElementProps) => {
    /*
    const disabled = pydanticFormField.attributes?.disabled || false;
    const components = getPydanticFormComponents(
        pydanticFormField.properties || {},
        {},
    );

    // We have decided - for now - on the convention that all descendants of disabled fields will be disabled as well
    // so we will not displaying any interactive elements inside a disabled element
    if (disabled) {
        components.forEach((component) => {
            component.pydanticFormField = disableField(
                component.pydanticFormField,
            );
        });
    }

    return (
        <div
            data-testid={pydanticFormField.id}
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
            <RenderFields
                pydanticFormComponents={components}
                idPrefix={pydanticFormField.id}
            />
        </div>
    );§
    */
    return <div>ObjectField - TODO</div>;
};
