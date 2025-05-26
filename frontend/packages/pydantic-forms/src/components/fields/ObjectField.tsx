import React, { FC, ReactNode } from 'react';

import { usePydanticFormContext } from '@/core';
import { componentsMatcher } from '@/core';
import { PydanticFormElementProps } from '@/types';

import { RenderFields } from '../render';

export type ObjectFieldProps = PydanticFormElementProps & {
    customObjectFieldWrapper?: FC<{ children: ReactNode }>;
};

export const ObjectField = ({
                                pydanticFormField,
                                customObjectFieldWrapper: CustomObjectFieldWrapper,
                            }: ObjectFieldProps) => {
    const { config } = usePydanticFormContext();

    const components = componentsMatcher(
        pydanticFormField.properties || {},
        config?.componentMatcher,
    );

    const content = <RenderFields pydanticFormComponents={components} />;

    return CustomObjectFieldWrapper ? (
        <CustomObjectFieldWrapper>{content}</CustomObjectFieldWrapper>
    ) : (
        <>
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
                {content}
            </div>
        </>
    )
};
