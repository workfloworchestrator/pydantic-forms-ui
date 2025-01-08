/**
 * Pydantic Forms
 *
 * Text component
 */
import React from 'react';
import {
    Controller,
    ControllerRenderProps,
    FieldValues,
} from 'react-hook-form';

import FieldWrap from '@/components/fields/FieldWrap';
import { zodValidationPresets } from '@/components/zodValidations';
import { usePydanticFormContext } from '@/core';
import {
    PydanticFormComponent,
    PydanticFormField,
    PydanticFormInputFieldProps,
} from '@/types';

interface TextFieldProps {
    value: string;
    onChangeValue: (val: string) => void;
    onBlur: () => void;
    disabled: boolean;
}

// Imported from import from "@lib/rijkshuisstijl" in the original code
// Mocked until layoutProvider pattern is implemented
const TextComponent = ({
    value,
    onChangeValue,
    onBlur,
    disabled,
}: TextFieldProps) => {
    // eslint-disable-next-line no-console
    console.log(
        'TODO: Implement onChageValue, onBlur, disabled',
        onChangeValue,
        onBlur,
        disabled,
    );
    return <>{value}</>;
};

function ControlledTextField(fieldConfig: PydanticFormField) {
    const { rhf } = usePydanticFormContext();

    return function TextInput({
        field,
    }: {
        field: ControllerRenderProps<FieldValues, string>;
    }) {
        const changeHandle = (val: string) => {
            field.onChange(val);

            // it seems we need this because the 2nd error would get stale..
            // https://github.com/react-hook-form/react-hook-form/issues/8170
            // https://github.com/react-hook-form/react-hook-form/issues/10832
            rhf.trigger(field.name);
        };

        return (
            <FieldWrap field={fieldConfig}>
                <TextComponent
                    value={field.value ?? ''}
                    onChangeValue={changeHandle}
                    onBlur={field.onBlur}
                    disabled={!!fieldConfig.attributes.disabled}
                />
            </FieldWrap>
        );
    };
}

const TextField: PydanticFormComponent = {
    Element: function FieldControllerWrap({
        field,
    }: PydanticFormInputFieldProps) {
        const { rhf } = usePydanticFormContext();

        return (
            <Controller
                name={field.id}
                control={rhf.control}
                render={ControlledTextField(field)}
            />
        );
    },
    validator: zodValidationPresets.string,
};

export default TextField;
