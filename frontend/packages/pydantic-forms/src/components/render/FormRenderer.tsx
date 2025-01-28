import React from 'react';

import type { PydanticFormData, FormRenderer as Renderer } from '@/types';

export const FormRenderer: Renderer = ({
    pydanticFormData,
}: {
    pydanticFormData: PydanticFormData;
}) => {
    return <div>DEFAULT FORM RENDERER {pydanticFormData.title}</div>;
};
/*
{formData.sections.map((section) => (
    <RenderSections section={section} key={section.id}>
        {({ fields }) => (
            <div>
                {formLayout === PydanticFormLayout.ONE_COL ? (
                    <div className="row-with-child-rows">
                        <RenderFields fields={fields} />
                    </div>
                ) : (
                    <div className="row-with-child-rows">
                        <RenderFields fields={fields} />
                    </div>
                )}
            </div>
        )}
    </RenderSections>
))}
    */
