import React from 'react';
import { useFieldArray } from 'react-hook-form';

import { usePydanticFormContext } from '@/core';
import { fieldToComponentMatcher } from '@/core';
import { PydanticFormElementProps } from '@/types';

import { RenderFields } from '../render';

export const ArrayField = ({ pydanticFormField }: PydanticFormElementProps) => {
    const { rhf, config } = usePydanticFormContext();
    const { control } = rhf;
    const { id: arrayName, arrayItem } = pydanticFormField;

    const { fields, append, remove } = useFieldArray({
        control,
        name: arrayName,
    });

    if (!arrayItem) return '';

    const component = fieldToComponentMatcher(
        arrayItem,
        config?.componentMatcher,
    );

    return (
        <div>
            {fields.map((field, index) => {
                return (
                    <div
                        key={field.id}
                        style={{ display: 'flex', gap: '10px' }}
                    >
                        <RenderFields
                            components={[
                                {
                                    Element: component.Element,
                                    pydanticFormField: {
                                        ...component.pydanticFormField,
                                        id: `${arrayName}.${index}`,
                                    },
                                },
                            ]}
                        />
                        <span onClick={() => remove(index)}>-</span>
                    </div>
                );
            })}

            <div
                onClick={() => {
                    append({ [arrayName]: pydanticFormField.default });
                }}
                style={{
                    cursor: 'pointer',
                    fontSize: '20px',
                }}
            >
                +
            </div>
        </div>
    );
};
