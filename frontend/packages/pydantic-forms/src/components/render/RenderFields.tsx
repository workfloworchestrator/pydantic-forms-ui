/**
 * Pydantic Forms
 *
 * This component will render all the fields based on the
 * config in the pydanticFormContext
 */
import React from 'react';

import { WrapFieldElement } from '@/core/WrapFieldElement';
import { useGetGetComponentMatcher } from '@/core/hooks/useGetComponentMatcher';
import { PydanticFormField } from '@/types';

interface RenderFieldsProps {
    fields: PydanticFormField[];
}

export function RenderFields({ fields }: RenderFieldsProps) {
    const componentMatcher = useGetGetComponentMatcher();

    return fields.map((field) => {
        const { Element, isControlledElement } = componentMatcher(field);

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
