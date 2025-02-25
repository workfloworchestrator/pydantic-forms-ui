import React from 'react';
import { Controller } from 'react-hook-form';

import { FieldWrap } from '@/components/fields';
import type { PydanticFormControlledElement, PydanticFormField } from '@/types';

import { usePydanticFormContext } from './PydanticFormContextProvider';

export const WrapFieldElement = ({
    PydanticFormControlledElement,
    pydanticFormField,
}: {
    PydanticFormControlledElement: PydanticFormControlledElement;
    pydanticFormField: PydanticFormField;
}) => {
    const { rhf } = usePydanticFormContext();
    return (
        <Controller
            name={pydanticFormField.id}
            control={rhf.control}
            render={({ field, fieldState }) => {
                const { onChange, onBlur, value, name, ref } = field;

                const onChangeHandle = (val: string) => {
                    onChange(val);

                    // it seems we need this because the 2nd error would get stale..
                    // https://github.com/react-hook-form/react-hook-form/issues/8170
                    // https://github.com/react-hook-form/react-hook-form/issues/10832
                    rhf.trigger(field.name);
                };

                return (
                    <FieldWrap
                        pydanticFormField={pydanticFormField}
                        fieldState={fieldState}
                    >
                        <PydanticFormControlledElement
                            onChange={onChangeHandle}
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
