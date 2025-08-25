import React from 'react';
import { useFieldArray } from 'react-hook-form';

import { usePydanticFormContext } from '@/core';
import { fieldToComponentMatcher } from '@/core/helper';
import { PydanticFormElementProps } from '@/types';
import { disableField, itemizeArrayItem } from '@/utils';

import { RenderFields } from '../render';

export const ArrayField = ({ pydanticFormField }: PydanticFormElementProps) => {
    const { reactHookForm, config } = usePydanticFormContext();

    const disabled = pydanticFormField.attributes?.disabled || false;
    const { control } = reactHookForm;
    const { id: arrayName, arrayItem } = pydanticFormField;
    const { fields, append, remove } = useFieldArray({
        control,
        name: arrayName,
    });
    const { minItems = 1, maxItems = undefined } =
        pydanticFormField?.validations;

    if (!arrayItem) return '';

    const component = fieldToComponentMatcher(
        arrayItem,
        config?.componentMatcherExtender,
    );

    const renderField = (field: Record<'id', string>, index: number) => {
        const itemizedField = itemizeArrayItem(index, arrayItem, arrayName);
        // We have decided - for now - on the convention that all descendants of disabled fields will be disabled as well
        // so we will not displaying any interactive elements inside a disabled element
        const arrayItemField = disabled
            ? disableField(itemizedField)
            : itemizedField;

        return (
            <div
                key={field.id}
                style={{
                    display: 'flex',
                    gap: '10px',
                    alignItems: 'center',
                    margin: '4px 0',
                }}
            >
                <RenderFields
                    pydanticFormComponents={[
                        {
                            Element: component.Element,
                            pydanticFormField: arrayItemField,
                        },
                    ]}
                    extraTriggerFields={[arrayName]}
                />
                {(!minItems || (minItems && fields.length > minItems)) &&
                    !disabled && (
                        <span
                            onClick={() => {
                                remove(index);
                            }}
                        >
                            -
                        </span>
                    )}
            </div>
        );
    };

    return (
        <div
            data-testid={arrayName}
            style={{
                border: '1px solid #ccc',
                padding: '1rem',
                marginTop: '16px',
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
            }}
        >
            {fields.map(renderField)}
            {(!maxItems || (maxItems && fields.length < maxItems)) &&
                !disabled && (
                    <div
                        onClick={() => {
                            append({
                                [arrayName]: arrayItem.default,
                            });
                        }}
                        style={{
                            cursor: 'pointer',
                            fontSize: '32px',
                            display: 'flex',
                            justifyContent: 'end',
                            marginTop: '8px',
                            marginBottom: '8px',
                            padding: '16px',
                        }}
                    >
                        +
                    </div>
                )}
        </div>
    );
};
