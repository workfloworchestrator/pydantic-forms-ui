import React from 'react';

import { PydanticFormElementProps } from '@/types';

export const HiddenField = ({
    pydanticFormField,
    rhf,
}: PydanticFormElementProps) => {
    return <input type="hidden" {...rhf.register(pydanticFormField.id)} />;
};
