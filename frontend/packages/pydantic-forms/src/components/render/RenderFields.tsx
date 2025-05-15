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
}

export function RenderFields({
    pydanticFormComponents,
    extraTriggerFields,
}: RenderFieldsProps) {
    return pydanticFormComponents.map((component) => {
        const { Element, isControlledElement } = component.Element;
        const field: PydanticFormField = component.pydanticFormField;

        if (!Element) {
            return undefined;
        }

        if (isControlledElement) {
            return (
                <div key={field.id}>
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
