import React from 'react';

import { RenderFields, RenderSections } from '@/components/render';
import { getFieldBySection } from '@/core/helper';
import type { FormRenderer as Renderer } from '@/types';

export const FormRenderer: Renderer = ({ pydanticFormData }) => {
    const formSections = getFieldBySection(pydanticFormData.fields);

    const sections = formSections.map((section) => (
        <RenderSections section={section} key={section.id}>
            {({ fields }) => (
                <div>
                    <RenderFields fields={fields} />
                </div>
            )}
        </RenderSections>
    ));

    return <div>{sections}</div>;
};
