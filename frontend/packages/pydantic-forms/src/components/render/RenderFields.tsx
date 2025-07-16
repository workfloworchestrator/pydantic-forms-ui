/**
 * Pydantic Forms
 *
 * This component will render all the fields based on the
 * config in the pydanticFormContext
 */
import React from 'react';

import { WrapFieldElement } from '@/core/WrapFieldElement';
import { PydanticFormComponents, PydanticFormField } from '@/types';

interface RenderFieldsProps {
    pydanticFormComponents: PydanticFormComponents;
    extraTriggerFields?: string[]; // The use case for this is that we want to trigger the array field aswell as the array item field
    idPrefix?: string; // This is used to prefix the id of the field for nested fields
}

export function RenderFields({
    pydanticFormComponents,
    extraTriggerFields,
    idPrefix = '',
}: RenderFieldsProps) {
    return pydanticFormComponents.map((component) => {
        const { Element, isControlledElement } = component.Element;
        const pydanticFormField: PydanticFormField =
            component.pydanticFormField;

        if (!Element) {
            return undefined;
        }

        const field = {
            ...pydanticFormField,
            id: idPrefix
                ? `${idPrefix}.${pydanticFormField.id}`
                : pydanticFormField.id,
        };
        if (isControlledElement) {
            return (
                <div css={{ width: '100%' }} key={field.id}>
                    <WrapFieldElement
                        PydanticFormControlledElement={Element}
                        pydanticFormField={field}
                        extraTriggerFields={extraTriggerFields}
                    />
                </div>
            );
        } else {
            return <Element pydanticFormField={field} key={field.id} />;
        }
    });
}
