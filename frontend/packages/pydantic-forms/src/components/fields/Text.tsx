/**
 * Dynamic Forms
 *
 * Text component
 */
import React from 'react';
import {
    Controller,
    ControllerRenderProps,
    FieldValues,
} from 'react-hook-form';

import DfFieldWrap from '@/components/fields/Wrap';
import { zodValidationPresets } from '@/components/zodValidations';
import { usePydanticFormContext } from '@/core';
import { FormComponent, IDFInputFieldProps, IDynamicFormField } from '@/types';

interface TextFieldProps {
    value: string;
    onChangeValue: (val: string) => void;
    onBlur: () => void;
    disabled: boolean;
}

const TextField = ({
    value,
    onChangeValue,
    onBlur,
    disabled,
}: TextFieldProps) => {
    return <>{value}</>;
};

function DhfCtrldTextField(dfFieldConfig: IDynamicFormField) {
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
            <DfFieldWrap field={dfFieldConfig}>
                <TextField
                    value={field.value ?? ''}
                    onChangeValue={changeHandle}
                    onBlur={field.onBlur}
                    disabled={!!dfFieldConfig.attributes.disabled}
                />
            </DfFieldWrap>
        );
    };
}

const DFTextField: FormComponent = {
    Element: function DFFieldControllerWrap({ field }: IDFInputFieldProps) {
        const { rhf } = usePydanticFormContext();

        return (
            <Controller
                name={field.id}
                control={rhf.control}
                render={DhfCtrldTextField(field)}
            />
        );
    },
    validator: zodValidationPresets.string,
};

export default DFTextField;
