import React from 'react';
import { useFieldArray } from 'react-hook-form';

import { usePydanticFormContext } from '@/core';
import { fieldToComponentMatcher } from '@/core/helper';
import {
    PydanticFormElementProps,
    PydanticFormField,
    PydanticFormFieldType,
} from '@/types';
import { itemizeArrayItem } from '@/utils';

import { RenderFields } from '../render';

export const ArrayField = ({ pydanticFormField }: PydanticFormElementProps) => {
    const { rhf, config } = usePydanticFormContext();

    const { control } = rhf;
    const { id: arrayName, arrayItem } = pydanticFormField;
    const { fields, append, remove } = useFieldArray({
        control,
        name: arrayName,
    });
    const { minItems = 1, maxItems = undefined } =
        pydanticFormField?.validations;

    const getInitialValue = (arrayItem?: PydanticFormField) => {
        switch (arrayItem?.type) {
            case PydanticFormFieldType.STRING:
                return '';
            case PydanticFormFieldType.INTEGER:
                return 0;
            case PydanticFormFieldType.BOOLEAN:
                return false;
            default:
                return undefined;
        }
    };

    if (!arrayItem) return '';

    const component = fieldToComponentMatcher(
        arrayItem,
        config?.componentMatcherExtender,
    );

    const renderField = (field: Record<'id', string>, index: number) => {
        const arrayItemField = itemizeArrayItem(index, arrayItem, arrayName);

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
                {(!minItems || (minItems && fields.length > minItems)) && (
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
                            [arrayName]:
                                arrayItem.default || getInitialValue(arrayItem),
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
