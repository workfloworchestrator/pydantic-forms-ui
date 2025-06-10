import React from 'react';

import { RenderFields } from '@/components/render';
import type { FormRenderComponent } from '@/types';

export const Form: FormRenderComponent = ({ pydanticFormComponents }) => {
    return <RenderFields pydanticFormComponents={pydanticFormComponents} />;
};
