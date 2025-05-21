import React from 'react';
import { useFieldArray } from 'react-hook-form';

import { usePydanticFormContext } from '@/core';
import { fieldToComponentMatcher } from '@/core';
import { PydanticFormElementProps } from '@/types';
import { itemizeArrayItem } from '@/utils';

import { RenderFields } from '../render';

export const ArrayField = ({ pydanticFormField }: PydanticFormElementProps) => {
    const { rhf, config } = usePydanticFormContext();
    const { control } = rhf;
    const { id: arrayName, arrayItem } = pydanticFormField;
    const { minItems, maxItems } = pydanticFormField.validations;
    const { fields, append, remove } = useFieldArray({
        control,
        name: arrayName,
    });
    if (!arrayItem) return '';

    const component = fieldToComponentMatcher(
        arrayItem,
        config?.componentMatcher,
    );

    const renderField = (field: Record<'id', string>, index: number) => {
        const arrayField = itemizeArrayItem(index, arrayItem);

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
                            pydanticFormField: arrayField,
                        },
                    ]}
                    extraTriggerFields={[arrayName]}
                />
                {(!minItems || (minItems && fields.length > minItems)) && (
                    <span onClick={() => remove(index)}>-</span>
                )}
            </div>
        );
    };

    return (
        <div
            style={{
                border: 'thin solid green',
                padding: '1rem',
                marginTop: '16px',
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
            }}
        >
            {fields.map(renderField)}

            {(!maxItems || (maxItems && fields.length < maxItems)) && (
                <div
                    onClick={() => {
                        append({
                            [arrayName]: arrayItem.default ?? undefined,
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
