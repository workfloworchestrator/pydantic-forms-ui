import React from 'react';
import { useFieldArray } from 'react-hook-form';

import { usePydanticFormContext } from '@/core';
import { fieldToComponentMatcher } from '@/core';
import {
    Properties,
    PydanticFormElementProps,
    PydanticFormField,
} from '@/types';

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

    const itemizeProperties = (
        properties: Properties,
        itemId: string,
    ): Properties | undefined => {
        const itemizedProperties = Object.entries(properties).reduce(
            (itemizedProperties, [key, property]) => {
                const itemizedKey = `${itemId}.${key.split('.').pop()}`;
                itemizedProperties[itemizedKey] = {
                    ...property,
                    properties: property.properties
                        ? itemizeProperties(property.properties, itemizedKey)
                        : undefined,
                    id: itemizedKey,
                };
                return itemizedProperties;
            },
            {} as Record<string, PydanticFormField>,
        );
        return itemizedProperties;
    };

    const itemizeArrayItem = (
        arrayIndex: number,
        item: PydanticFormField = arrayItem,
    ): PydanticFormField => {
        const itemId = `${item.id}.${arrayIndex}`;

        const properties = item.properties
            ? itemizeProperties(item.properties, itemId)
            : undefined;

        return {
            ...item,
            id: itemId,
            properties,
        };
    };

    return (
        <div>
            {fields.map((field, index) => {
                const arrayField = itemizeArrayItem(index);
                console.log('arrayField', arrayField);
                return (
                    <div
                        key={field.id}
                        style={{ display: 'flex', gap: '10px' }}
                    >
                        <RenderFields
                            components={[
                                {
                                    Element: component.Element,
                                    pydanticFormField: arrayField,
                                },
                            ]}
                            extraTriggerFields={[arrayName]}
                        />
                        {!minItems ||
                            (minItems && fields.length > minItems && (
                                <span onClick={() => remove(index)}>-</span>
                            ))}
                    </div>
                );
            })}

            {(!maxItems || (maxItems && fields.length < maxItems)) && (
                <div
                    onClick={() => {
                        append({
                            arrayName: pydanticFormField.default,
                        });
                    }}
                    style={{
                        cursor: 'pointer',
                        fontSize: '20px',
                    }}
                >
                    +
                </div>
            )}
        </div>
    );
};
