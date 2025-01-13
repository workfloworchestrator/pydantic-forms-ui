/**
 * React hook form controller
 */
import React from 'react';
import {
    Controller,
    ControllerFieldState,
    ControllerRenderProps,
    FieldValues,
    UseFormStateReturn,
} from 'react-hook-form';

import { usePydanticFormContext } from '@/core/PydanticFormContextProvider';
import { IDFInputFieldProps, IDynamicFormField } from '@/types';

type FieldComponent = (
    dfFieldConfig: IDynamicFormField,
) => ({
    field,
    fieldState,
    formState,
}: {
    field: ControllerRenderProps<FieldValues, string>;
    fieldState: ControllerFieldState;
    formState: UseFormStateReturn<FieldValues>;
}) => React.ReactElement;

export const DFFieldController = (FieldComponent: FieldComponent) => {
    return function DFFieldControllerWrap({ field }: IDFInputFieldProps) {
        const { rhf } = usePydanticFormContext();

        return (
            <Controller
                name={field.id}
                control={rhf.control}
                render={FieldComponent(field)}
            />
        );
    };
};
