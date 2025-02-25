/**
 * Pydantic Forms
 *
 * This component will render all the fields based on the
 * config in the pydanticFormContext
 */
import React from 'react';

import { WrapFieldElement } from '@/core/wrapFieldElement';
import { PydanticFormField } from '@/types';

interface RenderFieldsProps {
    fields: PydanticFormField[];
}

export function RenderFields({ fields }: RenderFieldsProps) {
    return fields.map((field) => {
        const { ElementMatch } = field.componentMatch || {};

        if (!ElementMatch?.Element) {
            return <></>;
        }

        if (ElementMatch.isControlledElement) {
            return (
                <div key={field.id}>
                    {WrapFieldElement(ElementMatch.Element, field)}
                </div>
            );
        } else {
            return (
                <ElementMatch.Element
                    pydanticFormField={field}
                    key={field.id}
                />
            );
        }
    });
}
