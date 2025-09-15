import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { FieldWrap } from '@/components/fields';
import type { PydanticFormControlledElement, PydanticFormField } from '@/types';

export const WrapFieldElement = ({
    PydanticFormControlledElement,
    pydanticFormField,
    extraTriggerFields,
}: {
    PydanticFormControlledElement: PydanticFormControlledElement;
    pydanticFormField: PydanticFormField;
    extraTriggerFields?: string[];
}) => {
    const { control, trigger } = useFormContext();
    return (
        <Controller
            name={pydanticFormField.id}
            control={control}
            render={({ field }) => {
                const { onChange, onBlur, value, name } = field;
                const onChangeHandle = (val: string) => {
                    onChange(val);

                    extraTriggerFields?.forEach((extraField) => {
                        trigger(extraField);
                    });

                    // it seems we need this because the 2nd error would get stale..
                    // https://github.com/react-hook-form/react-hook-form/issues/8170
                    // https://github.com/react-hook-form/react-hook-form/issues/10832
                    trigger(field.name);
                };

                return (
                    <FieldWrap pydanticFormField={pydanticFormField}>
                        <PydanticFormControlledElement
                            onChange={onChangeHandle}
                            onBlur={onBlur}
                            value={value || ''}
                            disabled={!!pydanticFormField.attributes.disabled}
                            name={name}
                            pydanticFormField={pydanticFormField}
                        />
                    </FieldWrap>
                );
            }}
        />
    );
};
