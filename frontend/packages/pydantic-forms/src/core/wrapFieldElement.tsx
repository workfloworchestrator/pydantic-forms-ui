import React from 'react';
import { Controller, useForm } from 'react-hook-form';

import { FieldWrap } from '@/components/fields';
import type { PydanticFormField, PydanticFormFieldElement } from '@/types';

export const wrapFieldElement = (
    PydanticFormFieldElement: PydanticFormFieldElement,
    pydanticFormField: PydanticFormField,
    rhf: ReturnType<typeof useForm>,
) => {
    return (
        <Controller
            name={pydanticFormField.id}
            control={rhf.control}
            render={({ field, fieldState, formState }) => {
                /* eslint-disable-next-line no-console */
                console.log(formState);
                const { onChange, onBlur, value, name, ref } = field;

                return (
                    <FieldWrap
                        pydanticFormField={pydanticFormField}
                        fieldState={fieldState}
                    >
                        <PydanticFormFieldElement
                            onChange={onChange}
                            onBlur={onBlur}
                            value={value || ''}
                            disabled={!!pydanticFormField.attributes.disabled}
                            name={name}
                            ref={ref}
                            pydanticFormField={pydanticFormField}
                        />
                    </FieldWrap>
                );
            }}
        />
    );
};
