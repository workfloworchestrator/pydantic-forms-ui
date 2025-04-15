import React from 'react';
import { useFieldArray } from 'react-hook-form';

import { usePydanticFormContext } from '@/core';
import { fieldToComponentMatcher } from '@/core';
import { PydanticFormElementProps, PydanticFormField } from '@/types';

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

    const itemizeArrayItem = (arrayIndex: number): PydanticFormField => {
        const itemId = `${arrayItem.id}.${arrayIndex}`;

        const properties = arrayItem.properties
            ? Object.entries(arrayItem.properties).reduce(
                  (itemizedProperties, [key, value]) => {
                      const itemizedKey = `${itemId}.${key.split('.').pop()}`;
                      itemizedProperties[itemizedKey] = {
                          ...value,
                          id: itemizedKey,
                      };
                      return itemizedProperties;
                  },
                  {} as Record<string, PydanticFormField>,
              )
            : {};

        return {
            ...arrayItem,
            id: itemId,
            properties,
        };
    };

    return (
        <div>
            {fields.map((field, index) => {
                const arrayField = itemizeArrayItem(index);

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
