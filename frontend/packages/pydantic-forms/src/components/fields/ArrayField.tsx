import React from 'react';
import { useFieldArray } from 'react-hook-form';

import { usePydanticFormContext } from '@/core';
import { fieldToComponentMatcher } from '@/core/helper';
import { PydanticFormElementProps } from '@/types';
import { itemizeArrayItem } from '@/utils';

import { RenderFields } from '../render';

export const ArrayField = ({ pydanticFormField }: PydanticFormElementProps) => {
    // TODO/NOTE: Default array values on nested object fields are not displayed correctly.
    // This looks like its a react-hook-form issue. It doesn't - so far - occur in WFO context so we
    // will not fix for now. Observed behavior:
    // - The default values are set.
    // - The array shows without items
    // - As soon as one item is added, the other items are automatically shown.
    // As possible fix is to do a setValue of the array field in useEffect.
    // Running a rhf.reset() in the RenderForm component works but introduces other issues, resetting the form when errors occur.

    const { rhf, config } = usePydanticFormContext();

    const { control } = rhf;
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
