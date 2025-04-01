import React from 'react';
import { useFieldArray } from 'react-hook-form';

import { usePydanticFormContext } from '@/core';
import { PydanticFormElementProps } from '@/types';

// import { RenderFields } from '../render';

export const ArrayField = ({ pydanticFormField }: PydanticFormElementProps) => {
    const { rhf } = usePydanticFormContext();
    const { control } = rhf;
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'test',
    });

    console.log('ArrayField', pydanticFormField);

    return (
        <div>
            <h1>{pydanticFormField.title}</h1>

            {fields.map((item, index) => {
                return (
                    <div key={item.id}>
                        <h2>{item.id}</h2>
                        <span onClick={() => remove(index)}>Remove</span>
                    </div>
                );
            })}

            <div>
                Controls:{' '}
                <span
                    onClick={() => {
                        console.log('append');
                        append({ name: 'test' });
                    }}
                >
                    Add
                </span>
            </div>
        </div>
    );
};
