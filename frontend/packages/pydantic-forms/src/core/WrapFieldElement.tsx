import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import _ from 'lodash';

import { FieldWrap } from '@/components/fields';
import { useGetValidationErrors } from '@/core/hooks';
import {
    PydanticFormControlledElement,
    PydanticFormField,
    PydanticFormValidationErrorDetails,
} from '@/types';

const getValidationErrorMsg = (
    errorResponse: PydanticFormValidationErrorDetails | null,
    path: string,
): string | undefined => {
    return errorResponse?.source?.find(
        (err) => err.loc.map(String).join('.') === path,
    )?.msg;
};

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
    const validationErrorDetails = useGetValidationErrors();

    return (
        <Controller
            name={pydanticFormField.id}
            control={control}
            render={({ field, fieldState }) => {
                const { onChange, onBlur, value, name } = field;

                const onChangeHandle = (inputValue: unknown) => {
                    if (
                        pydanticFormField.validations.isNullable &&
                        inputValue === ''
                    ) {
                        onChange(null);
                    } else {
                        onChange(inputValue);
                    }

                    extraTriggerFields?.forEach((extraField) => {
                        trigger(extraField);
                    });
                };

                return (
                    <FieldWrap
                        pydanticFormField={pydanticFormField}
                        isInvalid={fieldState.invalid}
                        frontendValidationMessage={
                            getValidationErrorMsg(
                                validationErrorDetails,
                                pydanticFormField.id,
                            ) ?? fieldState.error?.message
                        }
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
