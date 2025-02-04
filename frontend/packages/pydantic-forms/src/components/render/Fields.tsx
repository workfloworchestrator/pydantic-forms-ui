/**
 * Pydantic Forms
 *
 * This component will render all the fields based on the
 * config in the pydanticFormContext
 */
import React from 'react';

import { usePydanticFormContext } from '@/core';
import { wrapFieldElement } from '@/core/wrapFieldElement';
import { PydanticFormField } from '@/types';

interface RenderFieldsProps {
    fields: PydanticFormField[];
}

export function RenderFields({ fields }: RenderFieldsProps) {
    const { rhf } = usePydanticFormContext();

    return fields.map((field) => {
        const { ElementMatch } = field.componentMatch || {};

        if (!ElementMatch?.Element) {
            return <></>;
        }

        if (ElementMatch.isControlledElement) {
            return (
                <div key={field.id}>
                    {wrapFieldElement(ElementMatch.Element, field, rhf)}
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
