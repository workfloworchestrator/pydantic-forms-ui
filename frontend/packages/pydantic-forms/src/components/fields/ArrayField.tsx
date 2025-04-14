import React from 'react';
import { useFieldArray } from 'react-hook-form';

import { usePydanticFormContext } from '@/core';
import { fieldToComponentMatcher } from '@/core';
import { PydanticFormElementProps } from '@/types';

import { RenderFields } from '../render';

export const ArrayField = ({
    pydanticFormField,
    value,
    onChange,
}: // onChange,
PydanticFormElementProps) => {
    const { rhf } = usePydanticFormContext();
    const { config } = usePydanticFormContext();
    const { control } = rhf;
    const arrayName = pydanticFormField.id;
    const arrayItem = pydanticFormField.arrayItem;

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
                    <div key={field.id}>
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
                        <span onClick={() => remove(index)}>Remove</span>
                    </div>
                );
            })}

            <div
                onClick={() => {
                    append({ [arrayName]: pydanticFormField.default });
                }}
            >
                Add
            </div>
        </div>
    );
};
