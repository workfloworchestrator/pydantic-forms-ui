import React from 'react';

import { RenderFields } from '@/components/render';
import type { FormRenderer as Renderer } from '@/types';

export const FormRenderer: Renderer = ({ pydanticFormComponents }) => {
    return <RenderFields pydanticFormComponents={pydanticFormComponents} />;
};
