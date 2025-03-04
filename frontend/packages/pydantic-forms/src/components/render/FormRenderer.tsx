import React from 'react';

import { RenderFields, RenderSections } from '@/components/render';
import { getFieldBySection } from '@/core/helper';
import type { FormRenderer as Renderer } from '@/types';

export const FormRenderer: Renderer = ({ pydanticFormComponents }) => {
    const formSections = getFieldBySection(pydanticFormComponents);

    const sections = formSections.map((section) => (
        <RenderSections
            section={section}
            key={section.id}
            components={pydanticFormComponents}
        >
            {({ components }) => (
                <div>
                    <RenderFields components={components} />
                </div>
            )}
        </RenderSections>
    ));

    return <div>{sections}</div>;
};
