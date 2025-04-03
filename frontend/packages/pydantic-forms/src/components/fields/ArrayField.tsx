import React from 'react';
import { useFieldArray } from 'react-hook-form';

import { init } from 'next/dist/compiled/webpack/webpack';
import { array } from 'zod';

import { usePydanticFormContext } from '@/core';
import { PydanticFormElementProps } from '@/types';

// import { RenderFields } from '../render';

export const ArrayField = ({
    pydanticFormField,
    onChange,
}: PydanticFormElementProps) => {
    const { rhf } = usePydanticFormContext();
    const { control, watch } = rhf;

    const arrayName = pydanticFormField.id;
    // const arrayNameValue = watch(arrayName);

    const { fields, append, remove } = useFieldArray({
        control,
        name: arrayName,
    });

    return (
        <div>
            {fields.map((field, index) => {
                return (
                    <div key={field.id}>
                        <input
                            type="text"
                            {...rhf.register(`${arrayName}.${index}`, {
                                validate: async () => {
                                    return 'HAHAHAHAHA';
                                },
                            })}
                        />
                        <span onClick={() => remove(index)}>Remove</span>
                    </div>
                );
            })}

            <div
                onClick={() => {
                    append('');
                }}
            >
                Add
            </div>
        </div>
    );
};
