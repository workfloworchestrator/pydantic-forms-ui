import React from 'react';

import type { FormRenderComponent } from '../../types';
import { RenderFields } from '../render';

export const Form: FormRenderComponent = ({ pydanticFormComponents }) => {
    return <RenderFields pydanticFormComponents={pydanticFormComponents} />;
};
