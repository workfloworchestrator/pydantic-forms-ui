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
    components: PydanticFormComponents;
}

export function RenderFields({ components }: RenderFieldsProps) {
    return components.map((component) => {
        const { Element, isControlledElement } = component.Element;
        const field: PydanticFormField = component.pydanticFormField;

        if (!Element) {
            return <></>;
        }

        if (isControlledElement) {
            return (
                <div key={field.id}>
                    <WrapFieldElement
                        PydanticFormControlledElement={Element}
                        pydanticFormField={field}
                    />
                </div>
            );
        } else {
            return <Element pydanticFormField={field} key={field.id} />;
        }
    });
}
