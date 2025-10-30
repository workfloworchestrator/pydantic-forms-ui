import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import _ from 'lodash';

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
            render={({ field, fieldState }) => {
                const { onChange, onBlur, value, name } = field;
                const onChangeHandle = (value: unknown) => {
                    onChange(value);

                    extraTriggerFields?.forEach((extraField) => {
                        trigger(extraField);
                    });
                };

                return (
                    <FieldWrap
                        pydanticFormField={pydanticFormField}
                        isInvalid={fieldState.invalid}
                        frontendValidationMessage={fieldState.error?.message}
                    >
                        <PydanticFormControlledElement
                            onChange={onChangeHandle}
                            onBlur={onBlur}
                            value={!_.isUndefined(value) ? value : ''}
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
